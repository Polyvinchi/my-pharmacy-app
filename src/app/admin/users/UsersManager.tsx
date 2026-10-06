'use client'
import { useState, useEffect } from 'react'
import { getUsers, createUser, deleteUser, updateUserPassword, updateUserPermissions } from './actions'
import { UserPlus, Trash2, KeyRound, Loader2, ShieldAlert, User, ShieldCheck } from 'lucide-react'

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Create Form
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  
  // Permissions State
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const availablePermissions = [
    { id: 'settings:view', label: 'رؤية الإعدادات الأساسية' },
    { id: 'settings:edit', label: 'تعديل الإعدادات الأساسية' },
    { id: 'offers:view', label: 'رؤية العروض' },
    { id: 'offers:edit', label: 'إضافة وتعديل وحذف العروض' },
    { id: 'sections:view', label: 'رؤية الأقسام' },
    { id: 'sections:edit', label: 'إضافة وتعديل الأقسام' },
    { id: 'stats:view', label: 'رؤية الإحصائيات' }
  ]

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || newPassword.length < 6) {
      alert("يرجى إدخال بريد صحيح وكلمة مرور لا تقل عن 6 أحرف")
      return
    }
    setCreating(true)
    try {
      await createUser(newEmail, newPassword, selectedPermissions)
      setNewEmail('')
      setNewPassword('')
      setSelectedPermissions([])
      await loadUsers()
      alert("تم إنشاء المستخدم وتعيين الصلاحيات بنجاح")
    } catch (err: any) {
      alert("خطأ: " + err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم ${email}؟`)) return
    try {
      await deleteUser(id)
      await loadUsers()
    } catch (err: any) {
      alert("خطأ: " + err.message)
    }
  }

  const handleResetPassword = async (id: string) => {
    const newPass = prompt("أدخل كلمة المرور الجديدة (6 أحرف على الأقل):")
    if (!newPass) return
    if (newPass.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }
    try {
      await updateUserPassword(id, newPass)
      alert("تم تغيير كلمة المرور بنجاح")
    } catch (err: any) {
      alert("خطأ: " + err.message)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>

  return (
    <div className="space-y-8">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
          <UserPlus size={20} />
          إضافة موظف جديد وتحديد صلاحياته
        </h3>
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" placeholder="employee@pharmacy.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور</label>
              <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" placeholder="••••••••" minLength={6} />
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-bold mb-3 text-slate-700">صلاحيات هذا الموظف المخصصة:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availablePermissions.map(perm => (
                <label key={perm.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedPermissions.includes(perm.id)} 
                    onChange={() => togglePermission(perm.id)}
                    className="w-4 h-4 text-blue-600 accent-blue-600"
                  />
                  <span className="text-sm font-medium">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={creating} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
              {creating ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              إنشاء حساب بالصلاحيات المحددة
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-bold text-slate-600 text-sm">المستخدم</th>
              <th className="p-4 font-bold text-slate-600 text-sm w-1/2">الصلاحيات</th>
              <th className="p-4 font-bold text-slate-600 text-sm text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800" dir="ltr">{u.email}</div>
                      <div className="text-xs text-slate-400">تاريخ الانضمام: {new Date(u.created_at).toLocaleDateString('ar-EG')}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {u.role === 'super_admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                      <ShieldAlert size={14} /> وصول كامل (المدير العام)
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {u.permissions?.length > 0 ? (
                        u.permissions.map((p: string) => {
                          const label = availablePermissions.find(a => a.id === p)?.label || p;
                          return (
                            <span key={p} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                              <ShieldCheck size={12} className="text-emerald-500" />
                              {label}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-xs text-red-500">لا توجد صلاحيات (حساب معطل)</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  {u.role !== 'super_admin' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleResetPassword(u.id)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تغيير كلمة المرور">
                        <KeyRound size={18} />
                      </button>
                      <button onClick={() => handleDelete(u.id, u.email)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف المستخدم">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">لا يمكن تعديله</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
