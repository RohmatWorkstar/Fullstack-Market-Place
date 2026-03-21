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
    <div className="group bg-white rounded-2xl border border-surface-200 overflow-hidden hover-lift flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-surface-100 flex-shrink-0 block">
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
          <span className="px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-lg text-surface-700 shadow-sm border border-surface-200/50">
            {product.category}
          </span>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block mb-1 cursor-pointer">
          <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-surface-500 line-clamp-2 mb-4 flex-grow">
          {product.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-surface-900">
            {formatPrice(product.price)}
          </span>
          <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-primary-50 hover:text-primary-600 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
