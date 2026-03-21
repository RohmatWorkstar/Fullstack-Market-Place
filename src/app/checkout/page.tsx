'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items, clearCart, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceOrder = async () => {
     if (items.length === 0 || loading) return;
     
     setLoading(true);
     try {
       const supabase = createClient();
       const { data: { user } } = await supabase.auth.getUser();

       if (!user) {
         router.push('/login?redirect=/checkout');
         return;
       }

       // 1. Create the order
       const { data: order, error: orderError } = await supabase
         .from('orders')
         .insert({
           user_id: user.id,
           total: subtotal,
           status: 'pending'
         })
         .select()
         .single();

       if (orderError) throw orderError;

       // 2. Insert order items
       const orderItems = items.map(item => ({
         order_id: order.id,
         product_id: item.product.id,
         product_name: item.product.name,
         product_price: item.product.price,
         quantity: item.quantity,
         subtotal: item.product.price * item.quantity
       }));

       const { error: itemsError } = await supabase
         .from('order_items')
         .insert(orderItems);

       if (itemsError) throw itemsError;

       // 3. Clear cart
       clearCart();

       // 4. Redirect to order detail / payment page
       router.push(`/orders/${order.id}`);

     } catch (error) {
       console.error("Failed to place order:", error);
       alert("Failed to place order. Please try again.");
     } finally {
       setLoading(false);
     }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-custom max-w-4xl py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-surface-500 mb-8">Your cart is empty.</p>
        <Link href="/products"><Button>Go Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-4xl py-8 animate-fade-in">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 mb-2">Checkout</h1>
            <p className="text-surface-500">Review your order details below.</p>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-surface-900 mb-4 pb-4 border-b border-surface-200">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-surface-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-surface-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium text-surface-900 whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass bg-primary-50/30 rounded-3xl p-6 sm:p-8 sticky top-24">
            <h2 className="text-lg font-bold text-surface-900 mb-6">Payment Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Items Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-surface-600">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-surface-600">
                <span>Taxes</span>
                <span>Included</span>
              </div>
            </div>
            
            <div className="border-t border-surface-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-surface-900 text-lg">Total</span>
                <span className="font-bold text-primary-600 text-2xl">{formatPrice(subtotal)}</span>
              </div>
            </div>
            
            <Button className="w-full shadow-primary-500/25" size="lg" onClick={handlePlaceOrder} loading={loading}>
              <CheckCircle className="w-5 h-5 mr-2 -ml-2" /> Place Order
            </Button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-surface-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure transaction testing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
