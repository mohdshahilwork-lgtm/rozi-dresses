import React from 'react';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SafeImage from './SafeImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-4">
        <Link to={`/product/${product.id}`}>
          <SafeImage 
            src={product.image} 
            alt={product.name}
            objectFit="contain"
            className={`product-image-hover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
        </Link>
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
            <span className="bg-brand-dark text-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest z-10 rounded-none shadow-xl transform -rotate-12 border border-white/20">
              Sold Out
            </span>
          </div>
        )}

        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-brand-accent text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase z-10">
            {product.discount}% OFF
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${
              isFavorite ? 'text-brand-accent' : 'text-gray-400 hover:text-brand-accent'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2 z-10">
          <button 
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            className={`flex-1 bg-white text-brand-dark py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-brand-dark hover:text-white transition-all shadow-lg ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : ''
            }`}
          >
            <ShoppingCart size={14} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          <Link 
            to={`/product/${product.id}`}
            className="bg-white text-brand-dark p-3 shadow-lg hover:bg-brand-dark hover:text-white transition-all"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <div className="flex items-center text-brand-accent">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold ml-1">{product.rating}</span>
          </div>
          <span className="text-[10px] text-gray-300 font-medium">({product.reviewsCount})</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`} className="block font-serif text-lg font-medium mb-1 hover:text-brand-accent transition-colors leading-tight min-h-12 overflow-hidden">
          {product.name}
        </Link>
        <div className="flex items-center justify-center space-x-3">
          <span className="font-bold text-brand-dark">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};


export default ProductCard;
