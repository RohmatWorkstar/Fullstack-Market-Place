import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-surface-950 rounded-3xl border border-surface-200/60 dark:border-surface-900 overflow-hidden hover-lift flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-surface-50 dark:bg-surface-900 flex-shrink-0 block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-400">
            No image
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/90 dark:bg-surface-950/90 backdrop-blur-md rounded-full text-surface-900 dark:text-surface-50 shadow-sm border border-surface-200/50 dark:border-surface-800">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block mb-1 cursor-pointer">
          <h3 className="font-semibold text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-surface-500 dark:text-surface-300 line-clamp-2 mb-4 flex-grow">
          {product.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-surface-900 dark:text-surface-50">
            {formatPrice(product.price)}
          </span>
          <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0 border-none bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-all duration-300">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
