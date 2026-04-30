import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, CreditCard, Trash2, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SafeImage from '../ui/SafeImage';
import { useState } from 'react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    finalTotal, 
    discountAmount,
    activeCoupon,
    applyCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string, isError: boolean } | null>(null);

  const handleCheckout = () => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!key) {
      alert("Razorpay Key ID is not configured. Please add VITE_RAZORPAY_KEY_ID to your environment.");
      return;
    }

    if (cart.length === 0) return;

    const options = {
      key: key,
      amount: finalTotal * 100, // Amount in paise
      currency: "INR",
      name: "Rozi Dresses",
      description: "Apparel Order Payment",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200",
      handler: async function (response: any) {
        console.log("Payment Success:", response);
        
        // Post order to backend
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: "Guest User", // In real app, get from form
              phone: "9999999999",
              address: "Gorakhpur",
              products: cart,
              total: finalTotal,
              paymentId: response.razorpay_payment_id
            })
          });
        } catch (err) {
          console.error("Failed to save order:", err);
        }

        alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\n\nThank you for shopping with Rozi Dresses.`);
        setIsCartOpen(false);
      },
      prefill: {
        name: "Guest User",
        email: "guest@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#1A1A1A"
      },
      modal: {
        ondismiss: function() {
          console.log("Checkout modal closed");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Failed to initialize payment gateway. Please try again later.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const result = await applyCoupon(couponCode);
    setCouponMessage({ text: result.message, isError: !result.success });
    if (result.success) setCouponCode('');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={24} className="text-brand-accent" />
                <h2 className="text-xl font-serif font-bold uppercase tracking-wider">Your Shopping Bag</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                id="close-cart-btn"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                  <ShoppingBag size={80} className="text-gray-200" />
                  <div className="space-y-2">
                    <p className="text-lg font-serif">Your bag is empty</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Start adding some style to it!</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-brand-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm"
                  >
                    Go Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex space-x-4 group">
                    <div className="w-24 h-32 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                      <SafeImage src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold leading-tight pr-4">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-brand-accent transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-100 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-gray-50 text-gray-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`p-1 px-2 hover:bg-gray-50 text-gray-400 ${item.quantity >= item.stock ? 'opacity-30' : ''}`}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-brand-dark">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                {/* Coupon Code */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Coupon Code (e.g. ROZI10)" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white border border-gray-200 py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-brand-accent focus:outline-none transition-all rounded-sm uppercase"
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[10px] font-bold uppercase tracking-widest ${couponMessage.isError ? 'text-brand-accent' : 'text-green-600'}`}
                    >
                      {couponMessage.text}
                    </motion.p>
                  )}
                  {activeCoupon && (
                    <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 px-3 py-2 rounded-sm border border-green-100 italic">
                      <span>Applied: {activeCoupon.code}</span>
                      <span className="font-bold">-{activeCoupon.type === 'percentage' ? `${activeCoupon.value}%` : `₹${activeCoupon.value}`}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-serif font-bold text-brand-dark pt-3 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-dark text-white py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-xl group"
                >
                  <CreditCard size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Secure Checkout</span>
                </button>
                
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
