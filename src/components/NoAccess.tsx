import Link from 'next/link'
import { ShieldOff } from 'lucide-react'

export default function NoAccess({ fallback }: { fallback?: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
        <ShieldOff size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">لا تملك صلاحية الوصول لهذه الصفحة</h2>
      <p className="text-slate-500">تواصل مع المدير الرئيسي لإضافة الصلاحية لحسابك.</p>
      {fallback && (
        <Link href={fallback} className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">
          الذهاب لصفحة متاحة
        </Link>
      )}
    </div>
  )
}
