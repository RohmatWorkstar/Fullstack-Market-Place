'use client';

import { useState } from 'react';
import { ShoppingCart, CheckCircle, Minus, Plus } from 'lucide-react';
import { toast } from '@/stores/toast-store';
import { useCartStore } from '@/stores/cart-store';
import Button from '@/components/ui/Button';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const _addItem = useCartStore((state) => state.addItem);

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCart = () => {
    if (product.stock <= 0 || added) return;
    
    _addItem(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock <= 0) {
    return (
      <Button className="w-full" size="lg" disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center justify-between border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-2 bg-surface-50 dark:bg-surface-800 flex-shrink-0">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-1 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium text-surface-900 dark:text-surface-50">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= product.stock}
          className="p-1 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button
        size="lg"
        className={cn('flex-1 transition-all', added && 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 ring-emerald-500')}
        onClick={handleAddToCart}
        disabled={added || product.stock <= 0}
      >
        {added ? (
          <>
            <CheckCircle className="w-5 h-5" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
