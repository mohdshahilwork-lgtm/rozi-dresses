import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Plus,
  X,
  Upload
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { products, categories } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductContext';

const analyticsData = [
  { name: 'Mon', revenue: 4500, orders: 12 },
  { name: 'Tue', revenue: 5200, orders: 15 },
  { name: 'Wed', revenue: 3800, orders: 10 },
  { name: 'Thu', revenue: 6500, orders: 18 },
  { name: 'Fri', revenue: 4800, orders: 14 },
  { name: 'Sat', revenue: 8200, orders: 25 },
  { name: 'Sun', revenue: 9500, orders: 30 },
];

const categorySales = [
  { name: 'Ethnic', value: 400 },
  { name: 'Party', value: 300 },
  { name: 'Casual', value: 300 },
  { name: 'Daily', value: 200 },
];

const COLORS = ['#D40054', '#1A1A1A', '#F9E4E8', '#9CA3AF'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const { products: inventory, addProduct: contextAddProduct, deleteProduct: contextDeleteProduct } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCloudinaryUpload = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing. Please check .env.example");
      return;
    }

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        theme: "minimal",
        colors: {
          action: "#D40054",
          primary: "#1A1A1A"
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setNewProduct(prev => ({ ...prev, image: result.info.secure_url }));
          setIsUploading(false);
        }
      }
    );
    widget.open();
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Women',
    description: '',
    stock: '10'
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      name: newProduct.name,
      price: parseInt(newProduct.price),
      originalPrice: parseInt(newProduct.price) * 1.5,
      discount: 33,
      category: newProduct.category as any,
      image: newProduct.image,
      images: [newProduct.image],
      description: newProduct.description,
      isLatest: true,
      stock: parseInt(newProduct.stock),
      rating: 5.0,
      reviewsCount: 0
    };

    const success = await contextAddProduct(product);
    if (success) {
      setShowAddModal(false);
      setNewProduct({ name: '', price: '', image: '', category: 'Women', description: '', stock: '10' });
      alert('✅ Product added successfully!');
    } else {
      alert('❌ Failed to add product');
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'dashboard') {
      fetchOrders();
    }
  }, [activeTab]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-brand-accent', bg: 'bg-brand-pink/20' },
    { label: 'Total Customers', value: '856', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Products', value: inventory.length.toString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email === 'admin@rozidresses.com' && loginData.password === '123456') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await contextDeleteProduct(id);
      if (success) {
        alert('Product removed from inventory');
      } else {
        alert('Failed to delete product');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-sm shadow-2xl border border-brand-pink w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold italic mb-2">Admin Login</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Restricted Access</p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-brand-accent h-12" 
                placeholder="admin@rozidresses.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-brand-accent h-12" 
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-brand-dark text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-opacity-90 transition-all shadow-xl">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const lowStockProducts = inventory.filter(p => p.stock <= 5);

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-8">
          <h2 className="text-xl font-serif font-bold tracking-wider mb-10">ADMIN PANEL</h2>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'products', label: 'Inventory', icon: Package },
              { id: 'customers', label: 'Customers', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-pink/20 text-brand-accent border-r-4 border-brand-accent' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold">Welcome back, Admin</h1>
              <p className="text-gray-500 text-sm mt-1">Here's what's happening with Rozi Dresses today.</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white border border-gray-200 px-4 py-2 text-sm font-medium flex items-center space-x-2 rounded-sm shadow-sm">
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <button className="bg-brand-dark text-white px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-sm shadow-lg">
                Export Report
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center space-x-4"
              >
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} flex items-center justify-center rounded-full`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

                {activeTab === 'products' ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif font-bold text-2xl">Inventory Management</h3>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm flex items-center space-x-2 hover:bg-opacity-90 transition-all"
                      >
                        <Plus size={16} />
                        <span>Add New Product</span>
                      </button>
                    </div>
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                            <th className="px-12 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {inventory.map((p) => (
                            <tr key={p.id}>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <img src={p.image} className="w-10 h-10 object-cover rounded-sm" />
                                  <span className="text-sm font-bold">{p.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500">{p.category}</td>
                              <td className="px-6 py-4 text-xs font-bold">₹{p.price}</td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                                  {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} units`}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-3">
                                <button className="text-xs font-bold text-brand-dark hover:text-brand-accent uppercase">Edit</button>
                                <button onClick={() => deleteProduct(p.id)} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : activeTab === 'orders' ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h3 className="font-serif font-bold text-2xl">Order History</h3>
                      <button 
                        onClick={fetchOrders}
                        className="text-brand-accent text-xs font-bold uppercase tracking-widest flex items-center space-x-2"
                      >
                        <Package size={14} />
                        <span>Refresh Orders</span>
                      </button>
                    </div>
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.map((o) => (
                            <tr key={o.id}>
                              <td className="px-6 py-4">
                                <span className="text-sm font-bold">{o.id}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold">{o.customerName}</div>
                                <div className="text-[10px] text-gray-400">{o.phone}</div>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-xs font-bold font-mono">₹{o.total}</td>
                              <td className="px-6 py-4">
                                <select 
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2 border-none rounded-sm ${
                                    o.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                    o.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                    o.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                    'bg-orange-50 text-orange-600'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-xs font-bold text-brand-dark hover:text-brand-accent uppercase">View Details</button>
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && !isLoadingOrders && (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No orders found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-lg">Revenue Overview</h3>
                <select className="text-xs border-gray-200 focus:ring-brand-accent">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '0', border: '1px solid #f9e4e8' }}
                      itemStyle={{ color: '#D40054' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#D40054" strokeWidth={3} dot={{ r: 4, fill: '#D40054' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <h3 className="font-serif font-bold text-lg mb-8">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categorySales.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                      <span className="text-gray-500">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Low Stock Alerts */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif font-bold text-lg flex items-center space-x-2">
                  <AlertTriangle className="text-brand-accent" size={20} />
                  <span>Low Stock Alerts</span>
                </h3>
                <Link to="/admin" className="text-xs font-bold text-brand-accent uppercase border-b border-brand-accent">Manage Inventory</Link>
              </div>
              <div className="space-y-6">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <img src={p.image} className="w-12 h-12 object-cover rounded-sm" />
                      <div>
                        <h4 className="text-sm font-bold">{p.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-accent">{p.stock} left</p>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mt-1">Restock</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <h3 className="font-serif font-bold text-lg mb-8">Recent Orders</h3>
              <div className="space-y-6">
                {orders.slice(0, 4).map((order) => {
                  const Icon = order.status === 'Shipped' ? Truck : order.status === 'Packed' ? Clock : order.status === 'Delivered' ? CheckCircle : order.status === 'Cancelled' ? XCircle : Package;
                  const color = order.status === 'Shipped' ? 'text-blue-500' : order.status === 'Packed' ? 'text-orange-500' : order.status === 'Delivered' ? 'text-green-500' : order.status === 'Cancelled' ? 'text-red-500' : 'text-gray-500';
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{order.customerName}</h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Order {order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono">₹{order.total}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{order.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
                    </>
                  )}
        </div>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-6 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white z-[110] overflow-y-auto p-10 shadow-2xl rounded-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif font-bold italic">Add New Masterpiece</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-brand-dark">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border-b border-gray-100 py-3 focus:outline-none focus:border-brand-accent h-12 text-sm" 
                    placeholder="e.g. Royal Silk Lehenga"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price (₹)</label>
                    <input 
                      required
                      type="number" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full border-b border-gray-100 py-3 focus:outline-none focus:border-brand-accent h-12 text-sm" 
                      placeholder="999"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Quantity</label>
                    <input 
                      required
                      type="number" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full border-b border-gray-100 py-3 focus:outline-none focus:border-brand-accent h-12 text-sm" 
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border-b border-gray-100 py-3 focus:outline-none focus:border-brand-accent h-12 text-sm bg-transparent appearance-none rounded-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image Selection</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handleCloudinaryUpload}
                      className="flex-1 border border-brand-accent text-brand-accent py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      Upload to Cloudinary
                    </button>
                    <div className="flex-[2] relative">
                      <input 
                        required
                        type="url" 
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full border-b border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-accent h-12 text-sm" 
                        placeholder="Or paste direct image URL..."
                      />
                      <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full border border-gray-100 p-4 focus:outline-none focus:border-brand-accent min-h-32 text-sm italic font-serif" 
                    placeholder="Describe the elegance of this piece..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-dark text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-opacity-90 transition-all shadow-xl mt-4"
                >
                  Create Product
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
