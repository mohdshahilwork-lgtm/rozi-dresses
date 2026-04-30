import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-pink pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-serif font-bold tracking-wider">
            ROZI DRESSES
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium fashion for everyone. We bring you the latest trends with a touch of elegance, now featuring our Men's and Women's exclusive collections.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com/rozi_dresess_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6 uppercase tracking-widest text-sm">Shop</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/shop?category=Casual Wear" className="hover:text-brand-accent transition-colors">Casual Wear</Link></li>
            <li><Link to="/shop?category=Party Wear" className="hover:text-brand-accent transition-colors">Party Wear</Link></li>
            <li><Link to="/shop?category=Women" className="hover:text-brand-accent transition-colors">Women's Collection</Link></li>
            <li><Link to="/shop?category=Men" className="hover:text-brand-accent transition-colors">Men's Collection</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6 uppercase tracking-widest text-sm">Information</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-brand-accent transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6 uppercase tracking-widest text-sm">Newsletter</h4>
          <p className="text-sm text-gray-500 mb-4">Subscribe to receive updates on new arrivals and special offers.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-brand-beige border-none px-4 py-2 w-full text-sm focus:ring-1 focus:ring-brand-accent transition-all rounded-l-md"
            />
            <button className="bg-brand-dark text-white px-4 py-2 text-sm font-medium rounded-r-md hover:bg-opacity-90 transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-400 text-xs">
        <p>© 2026 Rozi Dresses | All Rights Reserved</p>
        <p>Created by Mohd Shahil</p>
      </div>
    </footer>
  );
}
