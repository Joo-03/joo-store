import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const message = `السلام عليكم! أرغب في طلب المنتجات التالية من متجر جو:\n\n${cartItems
      .map(item => `• ${item.title} (x${item.quantity}) - ${(item.price * item.quantity).toFixed(2)} ج.م`)
      .join('\n')}\n\nالإجمالي: ${getTotalPrice().toFixed(2)} ج.م\n\nشكراً لكم!`;

    const whatsappUrl = `https://wa.me/+201033725632?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
                <Card key={item.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                        <p className="text-lg font-bold text-primary mt-2">{item.price} ج.م</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(String(item.id))}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(String(item.id), item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(String(item.id), item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
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