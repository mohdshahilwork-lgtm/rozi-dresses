import { ArrowRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { motion } from 'motion/react';
import SafeImage from '../components/ui/SafeImage';
import Collections from '../components/home/Collections';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="space-y-32 pb-32 bg-[#FDFBF9]">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=100&w=2600&auto=format&fit=crop" 
            alt="Hero Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <span className="uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">New Collection 2026</span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1.1]">
              Trendy & Stylish Dresses for Every Occasion
            </h1>
            <Link 
              to="/shop"
              className="inline-flex items-center space-x-3 bg-white text-brand-dark px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-brand-pink hover:text-brand-dark transition-all shadow-2xl group"
            >
              <span>Shop Now</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Shop by Collection Section */}
      <Collections />

      {/* Featured Products Section */}
      <section className="bg-white py-32 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="uppercase tracking-[0.2em] text-xs font-bold text-brand-accent">Top Picks</span>
            <h2 className="text-4xl md:text-5xl leading-tight">Featured Products</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="max-w-7xl mx-auto px-6 h-96 relative flex items-center justify-center overflow-hidden rounded-sm">
        <SafeImage 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
          alt="Offer Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center text-white space-y-6 max-w-2xl px-4">
          <h2 className="text-5xl md:text-6xl">Summer Sale - Up to 50% Off</h2>
          <p className="text-lg opacity-90">Refresh your wardrobe with our latest summer arrivals at unbeatable prices. Limited time only!</p>
          <Link to="/shop" className="inline-block bg-white text-brand-dark px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-pink transition-all">
            Grab the Deal
          </Link>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "Ananya Sharma",
              role: "Fashion Blogger",
              content: "Rozi Dresses has become my go-to for all occasions. The quality and design of ethnic wear is just breathtaking!",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
            },
            {
              name: "Sneha Patel",
              role: "Daily Customer",
              content: "The daily wear collection is so comfortable yet stylish. Perfect for office and weekend brunches. Highly recommend!",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
            },
            {
              name: "Pooja Varma",
              role: "Party Enthusiast",
              content: "Bought a sequel gown for a wedding, and I was the talk of the night. The fit was perfect and price was unbelievable.",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
            }
          ].map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-sm shadow-sm relative space-y-6"
            >
              <Quote className="text-brand-pink absolute top-10 right-10" size={40} />
              <div className="flex space-x-1 text-brand-accent">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-gray-500 italic leading-relaxed">"{review.content}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <SafeImage 
                    src={review.avatar} 
                    alt={review.name}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{review.name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl md:text-7xl mb-10">Start Your Fashion Journey</h2>
        <Link 
          to="/shop" 
          className="bg-brand-dark text-white px-16 py-6 text-sm font-bold uppercase tracking-widest hover:bg-brand-pink hover:text-brand-dark transition-all shadow-xl inline-block"
        >
          Explore Full Collection
        </Link>
      </section>
    </div>
  );
}
