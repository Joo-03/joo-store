import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header = () => {
  const { getTotalItems, getTotalQuantity } = useCart();
  const uniqueItemsCount = getTotalItems();
  const totalQuantity = getTotalQuantity();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            متجر جو - Joo Store
          </Link>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart">
                  <Button variant="ghost" size="sm" className="relative hover:bg-accent">
                    <ShoppingCart className="h-6 w-6" />
                    {uniqueItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
                        {uniqueItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>سلة التسوق ({uniqueItemsCount} عنصر) - {totalQuantity} قطعة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;