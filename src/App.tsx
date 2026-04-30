/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import WhatsAppButton from './components/ui/WhatsAppButton';
import CartDrawer from './components/cart/CartDrawer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <WishlistProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
          <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
        </CartProvider>
      </ProductProvider>
    </WishlistProvider>
  );
}


