import Link from 'next/link';
import Image from 'next/image';
import { PackagePlus, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';
import DeleteProductButton from './DeleteProductButton';
import Translate from '@/components/Translate';

export default async function DashboardPage() {
  const supabase = await createClient();
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
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50"><Translate section="dashboard" textKey="title" /></h1>
          <p className="text-surface-500 dark:text-surface-300"><Translate section="dashboard" textKey="subtitle" /></p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="w-full sm:w-auto shadow-primary-500/25">
            <PackagePlus className="w-5 h-5" /> <Translate section="dashboard" textKey="addNew" />
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
                <tr className="bg-surface-50/50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 text-sm font-medium text-surface-500 dark:text-surface-300">
                  <th className="p-4 pl-6"><Translate section="dashboard" textKey="product" /></th>
                  <th className="p-4"><Translate section="dashboard" textKey="price" /></th>
                  <th className="p-4"><Translate section="dashboard" textKey="status" /></th>
                  <th className="p-4">Added</th>
                  <th className="p-4 pr-6 text-right"><Translate section="dashboard" textKey="actions" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors group">
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
                          <div className="font-medium text-surface-900 dark:text-surface-50 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-surface-900 dark:text-surface-50">{formatPrice(product.price)}</div>
                    </td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <Badge variant="success"><Translate section="dashboard" textKey="inStock" /> ({product.stock})</Badge>
                      ) : (
                        <Badge variant="danger"><Translate section="dashboard" textKey="outOfStock" /></Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-surface-500 dark:text-surface-300">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg">
                            <Edit2 className="w-4 h-4 text-surface-500 dark:text-surface-400" />
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
