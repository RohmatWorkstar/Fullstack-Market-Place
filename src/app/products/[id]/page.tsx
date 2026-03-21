import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Store, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';
import Badge from '@/components/ui/Badge';
import Translate from '@/components/Translate';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, seller:profiles(*)')
    .eq('id', params.id)
    .single();

  if (!product) {
    return notFound();
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> <Translate section="products" textKey="backToProducts" />
      </Link>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Product Image */}
        <div className="relative aspect-[4/3] md:aspect-square bg-surface-100 rounded-3xl overflow-hidden border border-surface-200">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-surface-400">
              <Translate section="products" textKey="noImage" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant="default" className="w-fit mb-4">{product.category}</Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 tracking-tight text-balance mb-4">
            {product.name}
          </h1>
          
          <div className="text-3xl font-bold text-primary-600 mb-6">
            {formatPrice(product.price)}
          </div>

          <div className="prose prose-surface max-w-none text-surface-600 mb-8">
            <p className="whitespace-pre-wrap">{product.description || <Translate section="products" textKey="noDesc" />}</p>
          </div>

          <div className="bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0 overflow-hidden">
                {product.seller?.avatar_url ? (
                  <Image src={product.seller.avatar_url} alt="Seller" fill sizes="40px" className="object-cover rounded-full" />
                ) : (
                   product.seller?.full_name?.charAt(0).toUpperCase() || 'S'
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-50 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-surface-400" />
                  {product.seller?.full_name || 'Unknown Seller'}
                </p>
                <p className="text-xs text-surface-500"><Translate section="products" textKey="verifiedSeller" /></p>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-surface-200/60">
               <div className="flex items-center gap-2 text-xs text-surface-600">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> <Translate section="products" textKey="secureTrans" />
               </div>
               <div className="flex items-center gap-2 text-xs text-surface-600">
                 <HelpCircle className="w-4 h-4 text-blue-500" /> <Translate section="products" textKey="buyerProtect" />
               </div>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex items-center justify-between text-sm">
               <span className="text-surface-600 font-medium"><Translate section="dashboard" textKey="status" /></span>
               {product.stock > 0 ? (
                 <span className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full"><Translate section="dashboard" textKey="inStock" /> ({product.stock})</span>
               ) : (
                 <span className="text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full"><Translate section="dashboard" textKey="outOfStock" /></span>
               )}
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
