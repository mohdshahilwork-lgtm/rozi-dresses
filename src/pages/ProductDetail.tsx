import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RefreshCcw, Star, MessageCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import SafeImage from '../components/ui/SafeImage';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, isLoading } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl mb-4">Product Not Found</h2>
          <Link to="/shop" className="text-brand-accent border-b border-brand-accent">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleOrderWhatsApp = () => {
    const message = `Hello Rozi Dresses! I'd like to order:
Product: ${product.name}
ID: ${product.id}
Size: ${selectedSize}
Price: ₹${product.price}`;
    window.open(`https://wa.me/917651995433?text=${encodeURIComponent(message)}`, '_blank');
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 mb-32">
        {/* Image Gallery */}
        <div className="flex-1 space-y-4">
          <div className="relative aspect-[3/4] bg-white rounded-sm overflow-hidden border border-gray-100 shadow-inner">
            <SafeImage 
              src={product.images[activeImageIndex] || product.image} 
              alt={product.name}
              objectFit="contain"
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-brand-dark text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest z-10">
                Out of Stock
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images || [product.image]).map((img, i) => (
              <div 
                key={i} 
                className={`aspect-[3/4] bg-white rounded-sm overflow-hidden transition-all cursor-pointer border-2 ${
                  activeImageIndex === i ? 'border-brand-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                onClick={() => setActiveImageIndex(i)}
              >
                 <SafeImage 
                  src={img} 
                  alt={`${product.name} ${i}`}
                  objectFit="contain"
                  className={activeImageIndex === i ? '' : 'grayscale'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold">{product.category}</span>
                <h1 className="text-4xl md:text-5xl font-serif mt-2">{product.name}</h1>
              </div>
              <div className="flex items-center space-x-1 bg-brand-pink/20 px-3 py-1 rounded-full">
                <Star size={14} className="text-brand-accent fill-brand-accent" />
                <span className="text-xs font-bold text-brand-dark">{product.rating}</span>
                <span className="text-[10px] text-gray-400 font-medium">({product.reviewsCount} Reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-brand-dark">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-brand-accent font-bold text-sm">({product.discount}% OFF)</span>
                </>
              )}
            </div>

            {isLowStock && (
              <div className="flex items-center space-x-2 text-brand-accent">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Only {product.stock} items left!</span>
              </div>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed text-lg italic font-serif">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest">Select Size</h3>
              <button className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent">Size Guide</button>
            </div>
            <div className="flex space-x-3">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={isOutOfStock}
                  className={`w-12 h-12 flex items-center justify-center text-xs font-bold transition-all border ${
                    selectedSize === size 
                      ? 'bg-brand-dark text-white border-brand-dark' 
                      : 'bg-white text-brand-dark border-gray-200 hover:border-brand-dark'
                  } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className={`flex-1 bg-brand-dark text-white py-5 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-xl ${isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <ShoppingCart size={18} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-full sm:w-16 h-16 flex items-center justify-center border transition-all ${
                isFavorite ? 'border-brand-accent text-brand-accent bg-brand-pink/10' : 'border-gray-200 hover:border-brand-accent hover:text-brand-accent'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-brand-accent' : ''} />
            </button>
            <button 
              onClick={handleOrderWhatsApp}
              className="flex-1 sm:grow-0 sm:w-auto bg-[#25D366] text-white py-5 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-xl shadow-green-200"
            >
              <MessageCircle size={18} />
              <span>Order on WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex items-start space-x-3">
              <Truck size={20} className="text-brand-accent shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase mb-1">Free Delivery</h4>
                <p className="text-[10px] text-gray-500">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RefreshCcw size={20} className="text-brand-accent shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase mb-1">Easy Returns</h4>
                <p className="text-[10px] text-gray-500">15-day return policy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck size={20} className="text-brand-accent shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase mb-1">Secure Payment</h4>
                <p className="text-[10px] text-gray-500">100% safe transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings */}
      <section className="mb-32 border-t border-gray-100 pt-32">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-4xl font-serif">Customer Reviews</h2>
            <div className="flex items-center space-x-4">
              <div className="text-6xl font-bold">{product.rating}</div>
              <div>
                <div className="flex text-brand-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on {product.reviewsCount} reviews</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-4">
                  <span className="text-xs font-bold w-4">{rating}</span>
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-accent" 
                      style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8">{rating === 5 ? 70 : rating === 4 ? 20 : 5}%</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-white border border-brand-dark text-brand-dark py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all">
              Write a Review
            </button>
          </div>

          <div className="lg:flex-grow space-y-12">
            {[
              { author: "Sonia Singh", date: "Oct 12, 2025", rating: 5, comment: "Absolutely stunning dress! The fabric is so soft and the fit is perfect. Received so many compliments at the party." },
              { author: "Meera Kapoor", date: "Sep 28, 2025", rating: 4, comment: "Beautiful design and color. Only giving 4 stars because delivery took a bit longer than expected, but the product is worth it." }
            ].map((review, idx) => (
              <div key={idx} className="space-y-4 pb-12 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{review.author}</h4>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{review.date}</span>
                </div>
                <div className="flex text-brand-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-gray-500 leading-relaxed italic">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-16">
            <h2 className="text-4xl">You May Also Like</h2>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-brand-accent pb-1">View Shop</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

