import { createClient } from '@/lib/supabase/server';
import { ClipboardList, Package, Clock, User } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Image from 'next/image';

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch order items where the product belongs to the current seller
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      subtotal,
      product_name,
      product_price,
      orders!inner (
        id,
        status,
        created_at,
        profiles (
          full_name
        )
      ),
      products!inner (
        seller_id,
        image_url
      )
    `)
    .eq('products.seller_id', user.id)
    .order('created_at', { foreignTable: 'orders', ascending: false });

  if (error) {
    console.error('Error fetching seller orders:', error);
  }

  return (
    <div className="space-y-6 animate-fade-in py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Order History</h1>
          <p className="text-surface-500 dark:text-surface-300">View products you have sold</p>
        </div>
      </div>

      {error && (
        <div className="glass rounded-3xl p-6 text-red-500">
          Failed to load order history. Please try again later.
        </div>
      )}

      {!error && (!orderItems || orderItems.length === 0) ? (
        <div className="glass rounded-3xl">
          <EmptyState
            icon={<ClipboardList className="w-12 h-12" />}
            title="No orders yet"
            description="When customers buy your products, they will appear here."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {orderItems?.map((item: any) => {
            const order = item.orders;
            const buyerName = order?.profiles?.full_name || 'Anonymous User';
            const productImg = item.products?.image_url;

            return (
              <div key={item.id} className="glass rounded-3xl p-6 hover-lift border-transparent hover:border-surface-200 transition-all">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4 pb-4 border-b border-surface-100 dark:border-surface-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Order #{order?.id?.substring(0, 8) || 'Unknown'}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {order?.created_at ? formatDate(order.created_at) : 'Unknown Date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={order?.status === 'paid' ? 'success' : order?.status === 'cancelled' ? 'danger' : 'warning'}>
                      {order?.status?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                    <div className="relative w-16 h-16 rounded-xl bg-surface-100 flex-shrink-0 overflow-hidden border border-surface-200 shadow-sm">
                      {productImg ? (
                        <Image src={productImg} alt={item.product_name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-surface-400">No Img</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50 line-clamp-1">{item.product_name}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-300 mb-1">Qty: {item.quantity} × {formatPrice(item.product_price)}</p>
                      <div className="flex items-center gap-1.5 text-xs text-surface-600 dark:text-surface-400">
                         <User className="w-3.5 h-3.5" /> Ordered by: <span className="font-medium">{buyerName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-surface-100 md:border-none">
                     <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Subtotal</p>
                     <p className="text-lg font-bold text-primary-600">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
