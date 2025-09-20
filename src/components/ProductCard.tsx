import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Check if product is already in cart using the unique code
  useEffect(() => {
    const itemInCart = cartItems.some(item => item.code === product.code);
    setIsInCart(itemInCart);
    
    if (itemInCart && isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, product.code, isAdded]);

  const handleAddToCart = useCallback(() => {
    console.log('Adding product to cart:', product);
    try {
      addToCart(product);
      setIsAdded(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [addToCart, product]);

  const [imageError, setImageError] = useState(false);
  
  // Get the base URL for the application
  const baseUrl = import.meta.env.BASE_URL || '';
  
  // Memoize image source to prevent unnecessary re-renders
  const getImageSrc = useCallback(() => {
    if (!product?.image) return '';
    // If it's already a full URL or data URL, use it as is
    if (product.image.startsWith('http') || product.image.startsWith('data:')) {
      return product.image;
    }
    // Otherwise, prepend the base URL if needed
    return product.image.startsWith('/') 
      ? `${baseUrl}${product.image.substring(1)}` 
      : `${baseUrl}${product.image}`;
  }, [product.image, baseUrl]);
  
  const imageSrc = getImageSrc();

  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          <p className="text-xl font-bold text-primary">{product.price} ج.م</p>
        </div>
        <Button 
          className={`w-full mt-4 ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'}`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              تمت الإضافة بنجاح
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              أضف للسلة
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;