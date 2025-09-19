import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          <p className="text-xl font-bold text-primary">${product.price}</p>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button hover:shadow-lg transition-all duration-200"
          size="sm"
        >
          <Plus className="w-4 h-4 ml-2" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;