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
      <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900">
            {tAuth.registerTitle}
          </h2>
          <p className="mt-2 text-sm text-surface-500">
            {tAuth.registerSubtitle}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <Alert variant="error" className="animate-fade-in">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
                  role === 'buyer'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:border-primary-200 dark:hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-700'
                )}
              >
                <div className={cn(
                  'p-2 rounded-full',
                  role === 'buyer' ? 'bg-primary-100 text-primary-600' : 'bg-surface-100'
                )}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{tAuth.buyer}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
                  role === 'seller'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:border-primary-200 dark:hover:border-primary-500 hover:bg-surface-50 dark:hover:bg-surface-700'
                )}
              >
                <div className={cn(
                  'p-2 rounded-full',
                  role === 'seller' ? 'bg-primary-100 text-primary-600' : 'bg-surface-100'
                )}>
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{tAuth.seller}</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-surface-400" />
              </div>
              <Input
                id="name"
                type="text"
                required
                placeholder={tAuth.fullName}
                className="pl-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-surface-400" />
              </div>
              <Input
                id="email"
                type="email"
                required
                placeholder={tAuth.email}
                className="pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-surface-400" />
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder={`${tAuth.password} (min 6 chars)`}
                className="pl-11"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            {tAuth.signUp}
          </Button>
          
          <div className="text-center text-sm text-surface-500">
            {tAuth.hasAccount}{' '}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500 hover:underline">
              {tAuth.signIn}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
