import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    clearCart 
  } = useCart();

  // Log cart items whenever they change
  useEffect(() => {
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return;

    try {
      const message = `السلام عليكم!\nأرغب في طلب المنتجات التالية من متجر جو:\n\n${cartItems
        .map(item => `• ${item.title}\n  الكود: ${item.code}\n  الكمية: ${item.quantity}`)
        .join('\n\n')}\n\nشكراً لكم!`;

      const whatsappUrl = `https://wa.me/+201033725632?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }, [cartItems, getTotalPrice]);

  const handleUpdateQuantity = useCallback((code: string, newQuantity: number) => {
    try {
      console.log(`Updating quantity for item ${code} to ${newQuantity}`);
      
      // Call updateQuantity directly - it will handle validation and updates
      updateQuantity(code, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((code: string) => {
    try {
      console.log('Removing item:', code);
      removeFromCart(code);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }, [removeFromCart]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
            <Card className="shadow-card">
              <CardContent className="p-12">
                <div className="text-muted-foreground mb-6">
                  <p className="text-lg">سلة التسوق فارغة</p>
                  <p className="text-sm mt-2">أضف بعض المنتجات للبدء!</p>
                </div>
                <Link to="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    متابعة التسوق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.code} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <img
                          src={item.image.startsWith('http') ? item.image : `${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            const base = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL;
                            e.currentTarget.src = `${base}/placeholder.svg`;
                          }}
                        />
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.price.toFixed(2)} ج.م
                            {item.code && <span className="text-xs block text-gray-500">كود: {item.code}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.code, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.code, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.code)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-card sticky top-24">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>الإجمالي:</span>
                    <span className="text-primary">{getTotalPrice().toFixed(2)} ج.م</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    الدفع عبر واتساب
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    إفراغ السلة
                  </Button>
                  <Link to="/">
                    <Button variant="ghost" className="w-full">
                      متابعة التسوق
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;