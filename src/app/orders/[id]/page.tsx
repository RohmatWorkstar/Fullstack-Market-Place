import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import PaymentDemo from './PaymentDemo';
import Translate from '@/components/Translate';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (!order || order.user_id !== user.id) {
    return notFound();
  }

  return (
    <div className="container-custom max-w-4xl py-8 animate-fade-in">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> <Translate section="orders" textKey="backToOrders" />
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-200 dark:border-surface-800 mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-1"><Translate section="orders" textKey="orderDetails" /></h1>
                <p className="text-sm text-surface-500 dark:text-surface-300">#{order.id}</p>
              </div>
              <Badge variant={order.status === 'paid' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} className="w-fit text-sm px-3 py-1">
                {order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
               <div>
                  <p className="text-surface-500 dark:text-surface-300 mb-1"><Translate section="orders" textKey="orderDate" /></p>
                  <p className="font-medium text-surface-900 dark:text-surface-50">{formatDate(order.created_at)}</p>
               </div>
               <div>
                  <p className="text-surface-500 dark:text-surface-300 mb-1"><Translate section="orders" textKey="totalAmount" /></p>
                  <p className="font-bold text-primary-600 text-lg">{formatPrice(order.total)}</p>
               </div>
            </div>

            <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-4"><Translate section="orders" textKey="items" /> ({order.order_items?.length})</h3>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                  <div className="flex items-center gap-4 border-r border-surface-200 dark:border-surface-800 pr-4 w-2/3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-900 flex items-center justify-center shrink-0 shadow-sm border border-surface-200 dark:border-surface-700">
                      <Package className="w-5 h-5 text-surface-400 dark:text-surface-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-surface-900 dark:text-surface-50 line-clamp-1">{item.product_name}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-300">Qty: {item.quantity} × {formatPrice(item.product_price)}</p>
                    </div>
                  </div>
                  <div className="font-bold text-surface-900 dark:text-surface-50 pl-4">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 space-y-6">
            <PaymentDemo order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
