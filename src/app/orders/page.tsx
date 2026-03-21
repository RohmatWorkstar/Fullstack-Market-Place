import { createClient } from '@/lib/supabase/server';
import { Package, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Unreachable due to middleware

  // Note: We need to use slightly different querying depending on our exact schema relations.
  // We'll fetch orders, then we can fetch the first item for preview if desired, or just show totals.
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(id, product_name, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container-custom max-w-4xl py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Order History</h1>
          <p className="text-surface-500">View and track your previous orders</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
         <div className="glass rounded-3xl">
           <EmptyState
             icon={<Package className="w-12 h-12" />}
             title="No orders yet"
             description="You haven't placed any orders. Start browsing our marketplace!"
             action={
               <Link href="/products">
                 <Button>Browse Products</Button>
               </Link>
             }
           />
         </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
             const itemCount = order.order_items?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0;
             const previewItem = order.order_items?.[0];

             return (
               <div key={order.id} className="glass rounded-3xl p-6 sm:p-8 hover-lift border-transparent hover:border-surface-200 transition-all cursor-default">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4 pb-4 border-b border-surface-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                           <Package className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-surface-900">Order #{order.id.substring(0, 8)}</p>
                           <p className="text-xs text-surface-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(order.created_at)}
                           </p>
                        </div>
                     </div>
                     <div className="flex sm:flex-col items-center justify-between sm:items-end gap-2">
                        <div className="font-bold text-surface-900">{formatPrice(order.total)}</div>
                        <Badge variant={order.status === 'paid' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                           {order.status}
                        </Badge>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <p className="text-sm text-surface-600">
                        {previewItem ? (
                           <>
                             Contains: <span className="font-medium text-surface-900">{previewItem.product_name}</span>
                             {itemCount > 1 && ` and ${itemCount - 1} other item${itemCount > 2 ? 's' : ''}`}
                           </>
                        ) : `${itemCount} items`}
                     </p>
                     
                     <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                           View Details <ArrowRight className="w-4 h-4" />
                        </Button>
                     </Link>
                  </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
