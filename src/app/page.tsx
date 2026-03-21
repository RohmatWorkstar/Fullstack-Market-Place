import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/products/ProductCard';
import { createClient } from '@/lib/supabase/server';
import Translate from '@/components/Translate';

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch latest products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, seller:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <div className="space-y-24 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-48">
        <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950">
           <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10 dark:opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-r from-surface-50 dark:from-surface-950 via-surface-50/80 dark:via-surface-950/80 to-transparent" />
        </div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl space-y-8">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-surface-900 border border-primary-100 dark:border-primary-900/50 text-sm font-medium text-primary-700 dark:text-primary-400 shadow-sm animate-slide-up" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
              <Translate section="home" textKey="tagline" />
            </div> */}
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-surface-950 dark:text-white text-balance animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Translate section="home" textKey="heroTitle" />
            </h1>
            
            <p className="text-lg text-surface-600 dark:text-surface-200 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Translate section="home" textKey="heroSubtitle" />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  <Translate section="home" textKey="startShopping" /> <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white dark:bg-surface-900">
                  <Translate section="home" textKey="becomeSeller" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShoppingBag className="w-6 h-6 text-primary-600" />,
              title: <Translate section="home" textKey="features" />,
              description: <Translate section="home" textKey="heroSubtitle" />
            },
            {
              icon: <Zap className="w-6 h-6 text-amber-500" />,
              title: <Translate section="home" textKey="securePayments" />,
              description: <Translate section="home" textKey="securePaymentsDesc" />
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
              title: <Translate section="home" textKey="verifiedSellers" />,
              description: <Translate section="home" textKey="verifiedSellersDesc" />
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-surface-50 dark:bg-surface-800/80 border border-surface-100/50 dark:border-surface-700 hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-900 shadow-sm border border-surface-100 dark:border-surface-800 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-50 mb-2">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50"><Translate section="home" textKey="newArrivals" /></h2>
            <p className="mt-2 text-surface-500 dark:text-surface-300"><Translate section="home" textKey="newArrivalsDesc" /></p>
          </div>
          <Link href="/products" className="hidden sm:flex group items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            <Translate section="home" textKey="viewAll" /> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-50 dark:bg-surface-800/50 rounded-3xl border border-surface-100 dark:border-surface-700 border-dashed">
            <Package className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100"><Translate section="home" textKey="noProductsYet" /></h3>
            <p className="text-surface-500 dark:text-surface-400 mt-1"><Translate section="home" textKey="noProductsDesc" /></p>
            <Link href="/register" className="mt-4 inline-block">
              <Button variant="outline"><Translate section="home" textKey="createSellerAccount" /></Button>
            </Link>
          </div>
        )}
        
        <div className="mt-10 sm:hidden">
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full justify-between">
              <Translate section="home" textKey="viewAll" /> <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
