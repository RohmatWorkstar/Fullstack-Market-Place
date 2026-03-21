'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Package, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import Button from '../ui/Button';
import { useCartStore } from '@/stores/cart-store';
import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';
import ThemeToggle from '../ThemeToggle';
import LanguageToggle from '../LanguageToggle';

/**
 * ## Phase 8: Cart System
 * - [x] Add to cart
 * - [x] Cart page (list items, update qty, remove)
 * - [/] Cart item count in navbar
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const { getTotals } = useCartStore();
  const cartItemCount = mounted ? getTotals().itemCount : 0;
  const { language } = useLanguageStore();
  const t = dictionaries[language].navbar;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsMobileMenuOpen(false);
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isSeller = profile?.role === 'seller';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass py-2 border-b' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold gradient-text flex-shrink-0">
            Marketplace.
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-100/50 border border-surface-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-surface-400 text-sm text-surface-900 dark:text-surface-100 dark:bg-surface-800 dark:border-surface-700 dark:focus:bg-surface-900 dark:placeholder:text-surface-500"
              />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-surface-200 pr-4 mr-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link
              href="/cart"
              className="relative p-2 text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {!loading && (
              <>
                {profile ? (
                  <div className="flex items-center gap-3 border-l border-surface-200 pl-4 ml-2">
                    {isSeller && (
                      <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="hidden lg:flex">
                          {t.dashboard}
                        </Button>
                      </Link>
                    )}
                    <Link href="/orders">
                      <Button variant="ghost" size="sm" className="hidden lg:flex">
                        {t.orders}
                      </Button>
                    </Link>
                    <div className="relative group cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center text-primary-700 font-semibold overflow-hidden relative">
                        {profile.avatar_url ? (
                          <Image src={profile.avatar_url} alt="avatar" fill sizes="36px" className="object-cover" />
                        ) : (
                          profile.full_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      {/* Dropdown menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-100 dark:border-surface-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                        <div className="p-3 border-b border-surface-100 dark:border-surface-800">
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50 truncate">
                            {profile.full_name}
                          </p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 capitalize mt-0.5">
                            {profile.role}
                          </p>
                        </div>
                        <div className="p-2 space-y-1">
                          {isSeller && (
                            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:text-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg lg:hidden">
                              <Package className="w-4 h-4" /> {t.dashboard}
                            </Link>
                          )}
                          <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:text-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg lg:hidden">
                            <ShoppingCart className="w-4 h-4" /> {t.orders}
                          </Link>
                          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:text-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg">
                            <User className="w-4 h-4" /> {t.profile}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <LogOut className="w-4 h-4" /> {t.logout}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">{t.login}</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">{t.signup}</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/cart" className="relative p-2 text-surface-600 dark:text-surface-300">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-surface-600 dark:text-surface-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 shadow-lg px-4 py-4 space-y-4 animate-fade-in">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-800 dark:border-surface-700 dark:placeholder:text-surface-500"
            />
          </form>
          
          <div className="pt-2 border-t border-surface-100 dark:border-surface-800 flex flex-col gap-2">
            {!loading && profile ? (
               <>
                 <div className="px-3 py-2">
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{profile.full_name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">{profile.role}</p>
                 </div>
                 {isSeller && (
                   <Link href="/dashboard" className="px-3 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg">
                     {t.dashboard}
                   </Link>
                 )}
                 <Link href="/orders" className="px-3 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-lg">
                   {t.orders}
                 </Link>
                 <button onClick={handleLogout} className="px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                   {t.logout}
                 </button>
               </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">{t.login}</Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full">{t.signup}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
