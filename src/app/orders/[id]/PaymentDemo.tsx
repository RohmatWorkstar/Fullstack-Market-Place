'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CreditCard, CheckCircle } from 'lucide-react';
import type { Order } from '@/lib/types';
import Script from 'next/script';

export default function PaymentDemo({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (order.status === 'paid') {
    return (
      <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-center gap-4 text-emerald-800 dark:text-emerald-300">
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-full shrink-0">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200">Payment Successful</h3>
          <p className="text-sm mt-0.5">Payment ID: {order.payment_id}</p>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    try {
      // If we already have a snap_token saved in DB (assuming added to order obj in future)
      let token = (order as any).snap_token;
      let isLocal = false;
      
      if (!token) {
        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        // Cek apakah API mengembalikan token Midtrans atau sukses simulasi lokal
        if (data.isLocalSimulation) {
          isLocal = true;
        } else {
          token = data.snapToken;
        }
      }
      
      /*
       * =========================================
       * 1) VERSI MIDTRANS INTEGRATION
       * =========================================
       * Uncomment blok di bawah ini jika ingin menggunakan Midtrans.
       */
      /*
      if (token && (window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: function (result: any) {
            router.refresh();
          },
          onPending: function (result: any) {
            alert('Waiting your payment!');
            router.refresh();
          },
          onError: function (result: any) {
            alert('Payment failed. Try again.');
          },
          onClose: function () {
            // Customer closed the popup without finishing payment
            setLoading(false);
          }
        });
      }
      else
      */
      

        
      /*
       * =========================================
       * 2) VERSI LOCAL DEV SIMULATION
       * =========================================
       */
      if (isLocal) {
        // Simulasi lokal sukses, langsung refresh halaman
        alert('Local payment simulation successful!');
        router.refresh();
      } 
      else {
         throw new Error('Snap.js not loaded or token missing. Please try again.');
      }
    } catch (error: any) {
      alert(error.message || 'Payment request failed.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <div className="p-6 sm:p-8 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-50 dark:bg-primary-950/20 p-3 rounded-xl shrink-0">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-surface-50">Awaiting Payment</h3>
            <p className="text-sm text-surface-500 dark:text-surface-300">Pay securely via Midtrans</p>
          </div>
        </div>
        
        <Button className="w-full" size="lg" onClick={handlePay} loading={loading}>
          Pay Now
        </Button>
      </div>
    </>
  );
}
