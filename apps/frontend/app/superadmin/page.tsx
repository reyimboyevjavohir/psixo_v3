import Link from 'next/link';

export default function SuperAdminPage() {
  return (
    <div className="container-page py-10 space-y-6">
      <div className="card bg-purple-50 border-purple-200">
        <div className="flex items-center gap-3">
          <span className="text-4xl">👑</span>
          <div>
            <h1 className="text-2xl font-bold text-purple-900">SuperAdmin Panel</h1>
            <p className="text-purple-600 text-sm">Platforma ustidan to'liq nazorat</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/superadmin/foydalanuvchilar" className="card hover:border-purple-300 hover:shadow-md transition-all group">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold group-hover:text-purple-700">Foydalanuvchilar</h3>
          <p className="text-sm text-slate-500 mt-1">Rol, blok va parolni boshqarish</p>
        </Link>
        <Link href="/admin" className="card hover:border-amber-300 hover:shadow-md transition-all group">
          <div className="text-3xl mb-3">🛠️</div>
          <h3 className="font-semibold group-hover:text-amber-700">Admin Panel</h3>
          <p className="text-sm text-slate-500 mt-1">Kontent va bronlarni boshqarish</p>
        </Link>
      </div>
    </div>
  );
}
