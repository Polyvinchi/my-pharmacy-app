'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LockScreen({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkLock = async () => {
      // Get current logged in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setUserEmail(user.email || null);
      
      // Check session storage
      const unlocked = sessionStorage.getItem('admin_unlocked');
      if (unlocked === 'true') {
        setIsLocked(false);
      }
      setLoading(false);
    };
    checkLock();
  }, [router]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError('');
    
    // Verify password by attempting to sign in again
    if (userEmail) {
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });
      
      if (error) {
        setError('كلمة المرور غير صحيحة');
        setLoading(false);
      } else {
        sessionStorage.setItem('admin_unlocked', 'true');
        setIsLocked(false);
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[9999]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[9999] p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-100 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-inner">
          <Lock size={40} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">جلسة مقفلة للأمان</h2>
        <p className="text-slate-500 text-sm text-center mb-8">
          يرجى إدخال كلمة المرور الخاصة بحسابك لفتح لوحة التحكم.
          <br/>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs mt-2 inline-block">{userEmail}</span>
        </p>

        <form onSubmit={handleUnlock} className="w-full">
          <div className="mb-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-left text-lg tracking-[0.2em] font-mono"
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Unlock size={20} />}
            فك القفل
          </button>
        </form>

        <button 
          onClick={handleLogout}
          className="mt-6 text-sm text-slate-500 hover:text-red-600 transition-colors font-medium underline underline-offset-4"
        >
          تسجيل الدخول بحساب مختلف
        </button>
      </div>
    </div>
  );
}
