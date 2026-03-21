'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items, removeItem, updateQuantity, getTotals } = useCartStore();
  const { subtotal } = getTotals();
  const { language } = useLanguageStore();
  const tCart = dictionaries[language].cart;
  const tCommon = dictionaries[language].common;

  // Wait for client mount to read Zustand store to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
     setLoading(true);
     const supabase = createClient();
     const { data: { user } } = await supabase.auth.getUser();

     if (!user) {
        // Must be logged in to checkout
        router.push('/login?redirect=/checkout');
        return;
     }

     router.push('/checkout');
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-custom max-w-4xl py-16 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">{tCart.title}</h1>
        <div className="glass rounded-3xl p-12 text-center text-surface-500">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-surface-300" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">{tCart.emptyTitle}</h2>
          <p className="mb-8">{tCart.emptyDesc}</p>
          <Link href="/products" className="inline-block">
            <Button size="lg">{tCart.startShopping}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-6xl py-8 animate-fade-in">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {tCart.startShopping}
      </Link>

      <h1 className="text-3xl font-bold text-surface-900 mb-8">{tCart.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-3xl overflow-hidden hidden sm:block">
            <div className="grid grid-cols-12 gap-4 border-b border-surface-200 dark:border-surface-800 px-6 py-4 bg-surface-50/50 dark:bg-surface-800/80">
              <div className="col-span-6 font-medium text-surface-600 text-sm uppercase tracking-wider">{tCart.product}</div>
              <div className="col-span-3 font-medium text-surface-600 text-sm uppercase tracking-wider text-center">{tCart.quantity}</div>
              <div className="col-span-3 font-medium text-surface-600 text-sm uppercase tracking-wider text-right">{tCart.total}</div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="glass rounded-3xl p-4 sm:px-6 relative group overflow-hidden">
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center">
                   
                   <div className="w-full sm:col-span-6 flex items-center gap-4 border-b border-surface-200 pb-4 sm:border-0 sm:pb-0">
                     <Link href={`/products/${item.product.id}`} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-100 flex-shrink-0 border border-surface-200 overflow-hidden block">
                        {item.product.image_url ? (
                           <Image src={item.product.image_url} alt={item.product.name} fill sizes="(max-width: 640px) 80px, 96px" className="object-cover transition-transform group-hover:scale-110" />
                        ) : (
                           <span className="w-full h-full flex items-center justify-center text-xs text-surface-400">No Img</span>
                        )}
                     </Link>
                     <div className="flex-1 min-w-0 pr-6">
                        <Link href={`/products/${item.product.id}`} className="text-base sm:text-lg font-semibold text-surface-900 hover:text-primary-600 transition-colors line-clamp-2 leading-tight mb-2">
                          {item.product.name}
                        </Link>
                        <p className="text-primary-600 font-medium sm:hidden mb-1">{formatPrice(item.product.price)}</p>
                        <p className="text-sm text-surface-500 sm:hidden">Max: {item.product.stock}</p>
                     </div>
                   </div>

                   <div className="w-full sm:col-span-3 flex justify-between sm:justify-center items-center">
                     <span className="text-sm text-surface-500 sm:hidden">Qty:</span>
                     <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-xl px-2 py-1.5 bg-white dark:bg-surface-900">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-surface-500 hover:text-surface-900 disabled:opacity-50"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-surface-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-surface-500 hover:text-surface-900 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                     </div>
                   </div>

                   <div className="w-full sm:col-span-3 flex justify-between sm:justify-end items-center">
                     <span className="text-sm text-surface-500 sm:hidden">{tCart.total}:</span>
                     <div className="font-bold text-surface-900 sm:text-lg">
                       {formatPrice(item.product.price * item.quantity)}
                     </div>
                     <button
                        onClick={() => removeItem(item.product.id)}
                        className="sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-6 p-2 text-surface-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        title="Remove item"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-3xl p-6 lg:p-8 sticky top-24 shadow-sm border-t-4 border-t-primary-500">
          <h2 className="text-xl font-bold text-surface-900 mb-6">{tCart.orderSummary}</h2>
          
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between text-surface-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-medium text-surface-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-surface-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
          </div>
          
          <div className="border-t border-surface-200 pt-6 mb-8">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-surface-900 text-lg">Total</span>
              <span className="font-bold text-primary-600 text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-surface-500 text-right">Includes taxes</p>
          </div>
          
          <Button className="w-full shadow-primary-500/25" size="lg" onClick={handleCheckout} loading={loading}>
            {tCart.checkout} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-surface-500">
            <span className="w-full h-px bg-surface-200"></span>
            <span className="flex-shrink-0 text-center">Secure Checkout</span>
            <span className="w-full h-px bg-surface-200"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
