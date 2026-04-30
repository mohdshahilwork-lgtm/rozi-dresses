import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories as categoryData } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import { Filter, ChevronDown, SlidersHorizontal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';

export default function Shop() {
  const { products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state when URL changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let res = [...products];
    
    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      res = res.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      res = res.filter(p => p.category === selectedCategory);
    }
    
    // Price Filter
    res = res.filter(p => p.price <= priceRange);
    
    // Sorting logic
    if (sortBy === 'price-low') res.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') res.sort((a, b) => b.price - a.price);
    if (sortBy === 'popularity') res.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'latest') {
      // In a real app, we'd sort by createdAt. For now, prioritize isLatest
      res.sort((a, b) => {
        if (a.isLatest && !b.isLatest) return -1;
        if (!a.isLatest && b.isLatest) return 1;
        return 0;
      });
    }
    
    return res;
  }, [selectedCategory, sortBy, priceRange, searchQuery]);

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl mb-6">Our Collection</h1>
        <p className="text-gray-500 max-w-xl mx-auto italic font-serif text-lg">
          "Beauty begins the moment you decide to be yourself." Discover the dress that reflects who you are.
        </p>
      </div>

      {/* Search Bar Section */}
      <div className="max-w-2xl mx-auto mb-16 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category or style..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-pink py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all rounded-sm shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center justify-center space-x-2 bg-brand-pink p-4 text-xs font-bold uppercase tracking-widest"
        >
          <SlidersHorizontal size={16} />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-12 shrink-0`}>
          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-gray-200">Categories</h3>
            <div className="flex flex-col space-y-4">
              {['All', ...categoryData.map(c => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-sm transition-colors ${
                    selectedCategory === cat ? 'text-brand-accent font-bold' : 'text-gray-500 hover:text-brand-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-gray-200">Price Range</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="500" 
                max="5000" 
                step="100" 
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-brand-accent"
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>₹500</span>
                <span className="text-brand-dark font-bold">Max: ₹{priceRange}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-gray-200">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent appearance-none rounded-none"
            >
              <option value="latest">Latest Arrivals</option>
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Showing {filteredProducts.length} Results</span>
            <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-400">
              <span>View:</span>
              <button className="text-brand-dark px-1">Grid</button>
              <button className="hover:text-brand-dark px-1">List</button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-sm">
              <p className="text-gray-400 italic">No products found matching your criteria.</p>
              <button 
                onClick={() => { handleCategoryChange('All'); setPriceRange(5000); setSearchQuery(''); }} 
                className="mt-4 text-brand-accent text-sm font-bold uppercase border-b border-brand-accent pb-0.5"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

