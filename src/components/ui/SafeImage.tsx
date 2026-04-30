import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff, Loader2 } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  objectFit?: 'cover' | 'contain' | 'scale-down' | 'fill';
}

export default function SafeImage({ 
  src, 
  alt, 
  className = "", 
  placeholderClassName = "",
  referrerPolicy = "no-referrer",
  objectFit = "cover"
}: SafeImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=100&w=2600&auto=format&fit=crop";

  const getOptimizedUrl = (url: string) => {
    if (!url) return url;

    // Handle Cloudinary optimization
    if (url.includes('res.cloudinary.com')) {
      // Add f_auto, q_auto if not present
      if (!url.includes('upload/f_auto,q_auto')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
      }
    }

    // Handle Unsplash optimization
    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?q=100&w=2600&auto=format&fit=crop`;
    }

    return url;
  };

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    setCurrentSrc(getOptimizedUrl(src));
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#FDFBF9] ${placeholderClassName} w-full h-full`}>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-[#FDFBF9] z-10"
          >
            <Loader2 className="w-8 h-8 text-brand-accent animate-spin opacity-50" />
          </motion.div>
        )}

        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-300 p-4 text-center"
          >
            <ImageOff className="w-10 h-10 mb-2 opacity-10" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Preserving Elegance</p>
            <img 
              src={FALLBACK_IMAGE} 
              alt="Fallback" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" 
            />
          </motion.div>
        ) : (
          <motion.img
            key={currentSrc}
            src={currentSrc}
            alt={alt}
            style={{ objectFit: objectFit }}
            className={`w-full h-full transition-all duration-1000 ease-in-out ${
              loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            } ${className}`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            loading="lazy"
            referrerPolicy={referrerPolicy}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
