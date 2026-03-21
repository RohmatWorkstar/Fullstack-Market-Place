'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CreditCard, CheckCircle } from 'lucide-react';
import type { Order } from '@/lib/types';

export default function PaymentDemo({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (order.status === 'paid') {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-emerald-800">
        <div className="bg-emerald-100 p-3 rounded-full shrink-0">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Payment Successful</h3>
          <p className="text-sm mt-0.5">Payment ID: {order.payment_id}</p>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      router.refresh(); // Refresh page to show paid status
    } catch (error: any) {
      alert(error.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-white border border-surface-200 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-50 p-3 rounded-xl shrink-0">
          <CreditCard className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="font-bold text-surface-900">Awaiting Payment</h3>
          <p className="text-sm text-surface-500">Use our sandbox to test the payment flow</p>
        </div>
      </div>
      
      <Button className="w-full" size="lg" onClick={handlePay} loading={loading}>
        Simulate Payment
      </Button>
    </div>
  );
}
