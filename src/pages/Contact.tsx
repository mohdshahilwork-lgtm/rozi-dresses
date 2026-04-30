import { Phone, Mail, MapPin, Send, MessageCircle, Instagram, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import SafeImage from '../components/ui/SafeImage';

export default function Contact() {
  const phoneNumber = "+91 76519 95433";
  const address = "BRD Medical College Road, Kanchanpur, Gorakhpur";
  const mapLink = "https://www.google.com/maps/@26.8310966,83.4189989";
  const instagramLink = "https://instagram.com/rozi_dresess_";
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/917651995433?text=Hello! I'd like to inquire about...`, '_blank');
  };

  const handleMap = () => {
    window.open(mapLink, '_blank');
  };

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl mb-6">Get in Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto italic font-serif text-lg">
          Questions or feedback? We'd love to hear from you. Visit us or reach out through any channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact info */}
        <div className="space-y-16">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif">Contact Information</h2>
            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm border border-brand-pink shrink-0">
                  <Phone size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Phone Number</h4>
                  <p className="text-gray-500 text-lg">{phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm border border-brand-pink shrink-0">
                  <Instagram size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Instagram</h4>
                  <a 
                    href={instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 text-lg hover:text-brand-accent transition-colors flex items-center space-x-2"
                  >
                    <span>@rozi_dresess_</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm border border-brand-pink shrink-0">
                  <Mail size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Email Address</h4>
                  <p className="text-gray-500 text-lg">info@rozidresses.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm border border-brand-pink shrink-0">
                  <MapPin size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Store Address</h4>
                  <p className="text-gray-500 text-lg leading-relaxed mb-4">{address}</p>
                  <button 
                    onClick={handleMap}
                    className="text-xs font-bold uppercase tracking-widest text-brand-accent border-b border-brand-accent pb-1 hover:text-brand-dark hover:border-brand-dark transition-all flex items-center space-x-2"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center space-x-3 bg-[#25D366] text-white px-10 py-5 rounded-sm font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl"
            >
              <MessageCircle size={22} />
              <span>WhatsApp Chat</span>
            </button>
            <button 
              onClick={handleMap}
              className="flex-1 flex items-center justify-center space-x-3 bg-brand-dark text-white px-10 py-5 rounded-sm font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl"
            >
              <MapPin size={22} />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Contact form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-sm shadow-2xl border border-brand-pink"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full border-b border-gray-200 py-3 focus:border-brand-accent focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full border-b border-gray-200 py-3 focus:border-brand-accent focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Subject</label>
              <input 
                type="text" 
                placeholder="How can we help?" 
                className="w-full border-b border-gray-200 py-3 focus:border-brand-accent focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Your Message</label>
              <textarea 
                rows={5} 
                placeholder="Write your message here..." 
                className="w-full border-b border-gray-200 py-3 focus:border-brand-accent focus:outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="button" 
              className="w-full bg-brand-dark text-white py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-lg"
            >
              <Send size={18} />
              <span>Send Message</span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-32 h-96 w-full grayscale opacity-50 relative overflow-hidden rounded-sm ring-1 ring-gray-100">
        <SafeImage 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
          alt="Map Placeholder" 
          placeholderClassName="h-full w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 shadow-2xl rounded-sm border border-brand-pink text-center">
            <MapPin className="text-brand-accent mx-auto mb-3" size={32} />
            <h4 className="font-serif font-bold italic mb-1">Our Store</h4>
            <p className="text-xs text-gray-500">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
