import { ShoppingBag, PackagePlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-custom max-w-6xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass rounded-3xl p-4 sticky top-24">
            <div className="mb-6 px-4">
              <h2 className="text-lg font-bold text-surface-900">Seller Dashboard</h2>
              <p className="text-sm text-surface-500">Manage your store</p>
            </div>
            
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                My Products
                <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
              </Link>
              <Link
                href="/dashboard/products/new"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-600 hover:bg-surface-50 hover:text-primary-600 transition-colors"
              >
                <PackagePlus className="w-5 h-5" />
                Add Product
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
