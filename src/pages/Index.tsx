import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductData extends Omit<Product, 'id'> {
  id: number | string;
  image: string;
  title: string;
  description: string;
  price: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper function to process products data
  const processProducts = (data: any[], baseUrl: string = '') => {
    // Update image paths to include the base URL if needed
    const processedData = data.map((product: any) => {
      // Create a new image URL that works in both dev and prod
      let imageUrl = product.image;
      if (imageUrl && imageUrl.startsWith('/')) {
        // For absolute paths, prepend the base URL in production
        imageUrl = `${baseUrl}${imageUrl}`.replace(/\/+$/, '');
      }
      
      return {
        ...product,
        image: imageUrl
      };
    });
    
    return processedData;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const isDev = import.meta.env.DEV;
        const baseUrl = import.meta.env.BASE_URL || '';
        
        let productsData: any[] = [];
        
        if (isDev) {
          // In development, use import to get the JSON data
          const module = await import('@/../public/products.json');
          productsData = module.default;
        } else {
          // In production, fetch from the public directory
          const productsPath = `${baseUrl}/products.json`.replace(/\/+$/, '');
          const url = new URL(productsPath, window.location.origin);
          
          const response = await fetch(url.toString(), {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch products from ${url.toString()}`);
          }
          
          productsData = await response.json();
        }
        
        // Process the products data
        const processedProducts = processProducts(productsData, isDev ? '' : baseUrl);
        
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set empty arrays to prevent errors in the UI
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            مرحباً بكم في <span className="text-primary">Joo Store</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            اكتشف مجموعتنا المختارة من المنتجات عالية الجودة.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن منتجات..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-48 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-muted rounded-lg h-96"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: ProductData) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    id: product.id.toString(),
                    price: Number(product.price)
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
