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
    <div className="group bg-white dark:bg-surface-900 rounded-[2rem] border border-surface-200/60 dark:border-surface-800/50 overflow-hidden hover-lift flex flex-col h-full shadow-sm hover:shadow-premium transition-all duration-500">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-surface-50 dark:bg-surface-950 flex-shrink-0 block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-400">
            No image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold bg-white/90 dark:bg-surface-900/90 backdrop-blur-md rounded-full text-primary-600 dark:text-primary-400 shadow-sm border border-surface-100 dark:border-surface-800">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block mb-2 cursor-pointer">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
          {product.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-surface-400 dark:text-surface-500 font-medium uppercase tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-surface-900 dark:text-surface-50">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button variant="secondary" size="sm" className="rounded-2xl w-12 h-12 p-0 border-none bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-all duration-500 group/btn">
            <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />
          </Button>
        </div>
      </div>
    </div>
  );
}
