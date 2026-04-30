import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SafeImage from '../ui/SafeImage';

const collections = [
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=100&w=2600",
    span: "md:col-span-2 md:row-span-2"
  },
  {
    name: "Men",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=format&w=2400",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    name: "Party Wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=100&w=2600",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    name: "New Arrivals",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=100&w=2600",
    span: "md:col-span-2 md:row-span-1"
  },
  {
    name: "Casual Wear",
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=format&w=2400",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    name: "Ethnic Wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=100&w=2600",
    span: "md:col-span-1 md:row-span-1"
  }
];

export default function Collections() {
  const navigate = useNavigate();

  const handleCollectionClick = (category: string) => {
    // If New Arrivals, we'll just go to shop with the latest filter
    if (category === 'New Arrivals') {
      navigate('/shop?sort=latest');
    } else {
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-4"
          >
            Curated Styles
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif italic font-bold text-brand-dark"
          >
            Shop by Collection
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-[1200px] md:h-[900px]">
          {collections.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCollectionClick(item.name)}
              className={`${item.span} group relative cursor-pointer overflow-hidden bg-gray-50`}
            >
              <SafeImage
                src={item.image}
                alt={item.name}
                objectFit="cover"
                className="transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors duration-500 flex flex-col items-center justify-center text-white">
                <div className="relative overflow-hidden py-2 px-6">
                   <h4 className="text-2xl font-serif font-bold italic tracking-wide translate-y-0 group-hover:-translate-y-full transition-transform duration-500">
                    {item.name}
                  </h4>
                  <h4 className="absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    Explore
                  </h4>
                </div>
                <div className="w-12 h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center mt-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
