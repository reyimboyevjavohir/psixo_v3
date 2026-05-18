import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { ok, fail } from '../utils/response.js';

// AI tavsiyalar - foydalanuvchi so'roviga javob beradi
export async function getAiAdvice(req: Request, res: Response) {
  try {
    const { message, history } = req.body as {
      message: string;
      history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    };

    if (!message || message.trim().length === 0) {
      res.status(400).json(fail("Xabar bo'sh bo'lishi mumkin emas"));
      return;
    }

    if (message.trim().length > 1000) {
      res.status(400).json(fail('Xabar 1000 belgidan oshmasin'));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json(fail('AI xizmati hozircha mavjud emas'));
      return;
    }

    // Krizis so'zlarni aniqlash
    const crisisWords = [
      'o\'zini o\'ldirmoq', 'o\'limni o\'ylamoq', 'hayotdan charchab', 'tiriklikdan to\'yib',
      'yashashni xohlamayman', 'o\'lmoqchi', 'suitsid', 'inqiroz', "o'ziga zarar"
    ];
    const isCrisis = crisisWords.some(w => message.toLowerCase().includes(w));

    if (isCrisis) {
      res.json(ok({
        reply: `Sizning his-tuyg'ularingiz menga juda muhim. Bu qiyin vaziyatda ekanligingizni tushunaman.\n\n🆘 **Iltimos, hoziroq yordam oling:**\n- Telefon: **1050** (Ishonch telefoni)\n- Yaqinlaringizdan biriga murojaat qiling\n- Platformamizdagi psixolog bilan tezda seans band qiling\n\nSiz yolg'iz emassiz. Professional yordam olish — kuchlilik belgisi.`,
        isCrisis: true,
      }, 'Krizis aniqlandi'));
      return;
    }

    const systemPrompt = `Siz "PsixoHelp" platformasining psixologik yordam assistentiSiz. 
Kognitiv-xulq-atvor terapiyasi (CBT) tamoyillariga asoslanib, foydalanuvchilarga O'zbek tilida yordam berasiz.

QOIDALAR:
1. Faqat o'zbek tilida javob bering
2. Ishlatiladigan uslub: iliq, empatik, professional
3. Tashxis qo'ymang — faqat tavsiyalar bering
4. Har bir javob 3-5 jumladan iborat bo'lsin
5. Zarur bo'lsa professional psixologga murojaat qilishni tavsiya eting
6. Javobni hech qachon "AI sifatida" yoki "dastur sifatida" boshlamang
7. Foydalanuvchini ism bilan chaqirmang

Siz faqat psixologik sohadagi savollariga javob berasiz. Boshqa mavzularda: "Bu savolga javob bera olmayman, lekin ruhiy salomatlik haqida savollaringiz bo'lsa yordam berishga tayyorman" deya xush muomala bilan rad eting.`;

    const chatHistory = Array.isArray(history) ? history.slice(-10) : [];

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[AI advice Gemini error]:', errText);
      res.status(502).json(fail("AI javob bera olmadi. Qaytadan urinib ko'ring."));
      return;
    }

    const geminiData = await geminiRes.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };

    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      res.status(502).json(fail("AI hozircha javob bera olmadi."));
      return;
    }

    // Foydalanuvchi xabarini log qilish (agar login bo'lsa)
    if (req.auth?.userId) {
      prisma.user.findUnique({ where: { id: req.auth.userId }, select: { id: true } })
        .catch(() => {}); // silent — faqat tekshirish uchun
    }

    res.json(ok({ reply, isCrisis: false }, 'AI javobi'));
  } catch (e) {
    console.error('[getAiAdvice]:', e);
    res.status(500).json(fail('Server xatoligi'));
  }
}
