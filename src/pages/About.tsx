import { motion } from 'motion/react';
import { Target, Heart, Sparkles, Award } from 'lucide-react';
import SafeImage from '../components/ui/SafeImage';

export default function About() {
  return (
    <div className="pt-32 pb-32 space-y-32">
      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-accent">Our Story</span>
          <h1 className="text-5xl md:text-7xl leading-tight">Rozi Dresses brings you affordable and stylish fashion.</h1>
          <p className="text-gray-500 leading-relaxed text-lg">
            What started as a small boutique in Gorakhpur has transformed into a destination for women who seek elegance and comfort without the premium price tag. We believe that every woman deserves to look her best, regardless of the occasion.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Our curated collections are inspired by traditional Indian aesthetics blended with modern silhouettes. Each piece at Rozi Dresses is selected with care, focusing on fabric quality, craftsmanship, and the latest trends.
          </p>
        </motion.div>
        <div className="relative">
          <SafeImage 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
            alt="About Rozi Dresses" 
            className="rounded-sm shadow-2xl"
          />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-pink -z-10 rounded-sm"></div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl">Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { icon: Heart, title: "Made with Love", desc: "Every design is curated thinking about our amazing customers." },
              { icon: Target, title: "Affordable Luxury", desc: "Premium fabrics and designs at prices that won't break the bank." },
              { icon: Sparkles, title: "Modern Designs", desc: "Always updating our collection with the latest global trends." },
              { icon: Award, title: "Quality Guarantee", desc: "Stitching and fabric quality that lasts through every wear." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 px-4">
                <div className="w-16 h-16 bg-brand-beige border border-brand-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon size={28} className="text-brand-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold italic">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Message Section */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-10">
        <h2 className="text-4xl italic font-serif">"Empowering Every Woman to Feel Her Most Beautiful"</h2>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl">
            <SafeImage 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" 
              alt="Founder" 
            />
          </div>
          <h4 className="font-bold uppercase tracking-widest text-sm">Rozi Khatun</h4>
          <p className="text-xs text-gray-400">Founder & CEO</p>
        </div>
      </section>
    </div>
  );
}
