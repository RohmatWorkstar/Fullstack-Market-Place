import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/products/ProductCard';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  
  // Fetch latest products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, seller:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <div className="space-y-24 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-primary-50/50" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary-100/50 to-transparent" />
        
        <div className="container-custom relative">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary-100 text-sm font-medium text-primary-700 shadow-sm animate-slide-up" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
              Next.js 14 App Router
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-surface-900 text-balance animate-slide-up" style={{ animationDelay: '100ms' }}>
              Discover amazing products from <span className="gradient-text">verified sellers</span>
            </h1>
            
            <p className="text-lg text-surface-600 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
              A modern, production-ready marketplace portfolio built with the latest web technologies. Experience seamless shopping and secure transactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Shopping <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
                  Become a Seller
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
              title: "Discover Unique Items",
              description: "Browse thousands of high-quality products from independent sellers."
            },
            {
              icon: <Zap className="w-6 h-6 text-amber-500" />,
              title: "Fast & Modern",
              description: "Built on Next.js App Router for lightning-fast page loads and SEO optimization."
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
              title: "Secure Verification",
              description: "Every seller is verified, ensuring a safe and reliable shopping experience."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-surface-50 border border-surface-100/50 hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-surface-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">{feature.title}</h3>
              <p className="text-surface-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-surface-900">New Arrivals</h2>
            <p className="mt-2 text-surface-500">The latest items added to our marketplace</p>
          </div>
          <Link href="/products" className="hidden sm:flex group items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-50 rounded-3xl border border-surface-100 border-dashed">
            <ShoppingBag className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No products yet</h3>
            <p className="text-surface-500 mt-1">Be the first to add a product!</p>
            <Link href="/register" className="mt-4 inline-block">
              <Button variant="outline">Create a seller account</Button>
            </Link>
          </div>
        )}
        
        <div className="mt-10 sm:hidden">
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full justify-between">
              View all products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
