'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/EmptyState';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh(); // Refresh to update user session state in layout
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-surface-500">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <Alert variant="error" className="animate-fade-in">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-surface-400" />
              </div>
              <Input
                id="email"
                type="email"
                required
                placeholder="Email address"
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
                placeholder="Password"
                className="pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            Sign in
          </Button>
          
          <div className="text-center text-sm text-surface-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
