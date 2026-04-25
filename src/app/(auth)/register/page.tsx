'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Store, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => setMounted(true), []);
  const tAuth = mounted ? dictionaries[language].auth : dictionaries.en.auth;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Usually email verification is required by Supabase default settings, 
    // but in a local/dev environment or if auto-confirm is on in Supabase, 
    // it will log the user in directly.
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass shadow-premium p-8 sm:p-12 rounded-[2.5rem] animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
            {tAuth.registerTitle}
          </h2>
          <p className="text-surface-500 dark:text-surface-400 font-medium">
            {tAuth.registerSubtitle}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <Alert variant="error" className="animate-fade-in rounded-2xl">
              {error}
            </Alert>
          )}

          <div className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300 hover-lift',
                  role === 'buyer'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-500/10'
                    : 'border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50 text-surface-500 dark:text-surface-400'
                )}
              >
                <div className={cn(
                  'p-3 rounded-2xl transition-colors',
                  role === 'buyer' 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500'
                )}>
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">{tAuth.buyer}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300 hover-lift',
                  role === 'seller'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-500/10'
                    : 'border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50 text-surface-500 dark:text-surface-400'
                )}
              >
                <div className={cn(
                  'p-3 rounded-2xl transition-colors',
                  role === 'seller' 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500'
                )}>
                  <Store className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">{tAuth.seller}</span>
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                <User className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500" />
              </div>
              <Input
                id="name"
                type="text"
                required
                placeholder={tAuth.fullName}
                className="pl-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                <Mail className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500" />
              </div>
              <Input
                id="email"
                type="email"
                required
                placeholder={tAuth.email}
                className="pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                <Lock className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500" />
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder={`${tAuth.password} (min 6 chars)`}
                className="pl-12"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full shadow-xl shadow-primary-500/25" loading={loading} size="lg">
              {tAuth.signUp}
            </Button>
          </div>
          
          <div className="text-center text-sm text-surface-500 dark:text-surface-400">
            {tAuth.hasAccount}{' '}
            <Link href="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 hover:underline transition-colors">
              {tAuth.signIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
