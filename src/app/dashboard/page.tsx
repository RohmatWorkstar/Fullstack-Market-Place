import Link from 'next/link';
import Image from 'next/image';
import { PackagePlus, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';
import DeleteProductButton from './DeleteProductButton';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Products</h1>
          <p className="text-surface-500">Manage your inventory and listings</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="w-full sm:w-auto shadow-primary-500/25">
            <PackagePlus className="w-5 h-5" /> Add New Product
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="glass rounded-3xl">
          <EmptyState
            icon={<PackagePlus className="w-12 h-12" />}
            title="No products yet"
            description="Start building your store by adding your first product."
            action={
              <Link href="/dashboard/products/new">
                <Button>Add Product</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-200 text-sm font-medium text-surface-500">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Added</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl bg-surface-100 flex-shrink-0 overflow-hidden border border-surface-200">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-surface-400">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-surface-900 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-surface-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-surface-900">{formatPrice(product.price)}</div>
                    </td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <Badge variant="success">In Stock ({product.stock})</Badge>
                      ) : (
                        <Badge variant="danger">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-surface-500">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg">
                            <Edit2 className="w-4 h-4 text-surface-500" />
                          </Button>
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
