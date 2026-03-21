import { Suspense } from 'react';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/products/ProductCard';
import { CATEGORIES } from '@/lib/types';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageSpinner } from '@/components/ui/Spinner';
import Translate from '@/components/Translate';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || '';
  const categoryFilter = searchParams.category || '';

  const supabase = createClient();
  let dbQuery = supabase
    .from('products')
    .select('*, seller:profiles(full_name)')
    .order('created_at', { ascending: false });

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  if (categoryFilter && categoryFilter !== 'all') {
    dbQuery = dbQuery.eq('category', categoryFilter);
  }

  const { data: products } = await dbQuery;

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass rounded-3xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5" /> <Translate section="products" textKey="filters" />
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-surface-700 mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  <Link
                    href={`/products?q=${query}`}
                    className={cn(
                      'block px-3 py-2 rounded-xl text-sm transition-colors',
                      !categoryFilter || categoryFilter === 'all'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800 dark:text-surface-400'
                    )}
                  >
                    <Translate section="products" textKey="allCategories" />
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${encodeURIComponent(cat)}&q=${query}`}
                      className={cn(
                        'block px-3 py-2 rounded-xl text-sm transition-colors',
                        categoryFilter === cat
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800 dark:text-surface-400'
                      )}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                {categoryFilter && categoryFilter !== 'all' ? categoryFilter : <Translate section="products" textKey="allProducts" />}
              </h1>
              <p className="text-surface-500 mt-1">
                {products?.length || 0} result{products?.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <form className="relative w-full sm:w-72" action="/products" method="GET">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500" />
              <input type="hidden" name="category" value={categoryFilter} />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm shadow-sm"
              />
            </form>
          </div>

          <Suspense fallback={<PageSpinner />}>
            {!products || products.length === 0 ? (
              <div className="text-center py-16 glass rounded-3xl">
                <ShoppingBag className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50"><Translate section="products" textKey="noProducts" /></h3>
                <p className="text-surface-500 mt-1"><Translate section="products" textKey="tryAdjusting" /></p>
                {(query || categoryFilter) && (
                  <Link href="/products" className="mt-6 inline-block">
                    <Button variant="outline"><Translate section="products" textKey="clearFilters" /></Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
