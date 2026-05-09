import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs this disabled for dev
  }));
  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use("/api/", limiter);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ADMIN AUTH
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    // Real usage would check DB and hash. For demo:
    if (email === "admin@rozidresses.com" && password === "123456") {
      res.json({ 
        success: true, 
        token: "rozi-admin-token-2026",
        user: { name: "Admin", email }
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // In-memory storage for products (initialized from data)
  let products: any[] = [
    {
      id: '1',
      name: 'Elegant Floral Midi',
      price: 1299,
      originalPrice: 1999,
      discount: 35,
      category: 'Casual Wear',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'A beautiful floral midi dress perfect for a sunny day out. Made with breathable cotton fabric.',
      isFeatured: true,
      isLatest: true,
      stock: 25,
      rating: 4.5,
      reviewsCount: 12
    },
    {
      id: '2',
      name: 'Evening Sequin Gown',
      price: 3499,
      originalPrice: 4999,
      discount: 30,
      category: 'Party Wear',
      image: 'https://images.unsplash.com/photo-1539109132313-d62a9ad78c91?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1539109132313-d62a9ad78c91?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'Shine at every party with this stunning sequin gown. Elegant design with a modern touch.',
      isFeatured: true,
      stock: 10,
      rating: 4.8,
      reviewsCount: 8
    },
    {
      id: '3',
      name: 'Designer Embroidered Kurti',
      price: 1899,
      originalPrice: 2599,
      discount: 27,
      category: 'Ethnic Wear',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599452388339-ccaacc3701bf?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610030469618-285662706bd3?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'Traditional kurti with intricate embroidery work. Soft pastel colors for a graceful look.',
      isFeatured: true,
      stock: 5,
      rating: 4.2,
      reviewsCount: 15
    },
    {
      id: '4',
      name: 'Cotton Daily Shift Dress',
      price: 899,
      originalPrice: 1299,
      discount: 30,
      category: 'Daily Wear',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550630968-67466abc414a?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'Comfortable cotton shift dress for everyday wear. Lightweight and stylish.',
      isLatest: true,
      stock: 50,
      rating: 4.0,
      reviewsCount: 20
    },
    {
      id: '5',
      name: 'Sky Blue Summer Dress',
      price: 1499,
      originalPrice: 1899,
      discount: 21,
      category: 'Casual Wear',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'A breezy sky blue dress, perfect for summer vacations and casual outings.',
      stock: 15,
      rating: 4.4,
      reviewsCount: 6
    },
    {
      id: '6',
      name: 'Midnight Velvet Dress',
      price: 2999,
      originalPrice: 3999,
      discount: 25,
      category: 'Party Wear',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=100&w=2600&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518767763163-d6d32aa30724?q=100&w=2600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=100&w=2600&auto=format&fit=crop'
      ],
      description: 'Luxurious midnight velvet dress for special evenings. Soft texture and elegant fit.',
      isLatest: true,
      stock: 0,
      rating: 4.9,
      reviewsCount: 4
    },
    {
      id: '7',
      name: 'Women Red Party Dress',
      price: 999,
      originalPrice: 1499,
      discount: 33,
      category: 'Women',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=100&w=2600&auto=format&fit=crop',
      images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=100&w=2600&auto=format&fit=crop'],
      description: 'Stylish red party wear dress, designed to make you stand out at any event.',
      isLatest: true,
      stock: 20,
      rating: 4.6,
      reviewsCount: 15
    },
    {
      id: '8',
      name: 'Women Casual Kurti',
      price: 699,
      originalPrice: 999,
      discount: 30,
      category: 'Women',
      image: 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=format&cs=tinysrgb&w=2400',
      images: ['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=format&cs=tinysrgb&w=2400'],
      description: 'Comfortable daily wear kurti with modern prints and breathable fabric.',
      isLatest: true,
      stock: 25,
      rating: 4.3,
      reviewsCount: 10
    },
    {
      id: '9',
      name: 'Men Stylish Shirt',
      price: 899,
      originalPrice: 1299,
      discount: 31,
      category: 'Men',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=format&cs=tinysrgb&w=2400',
      images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=format&cs=tinysrgb&w=2400'],
      description: 'Trendy casual shirt for men, perfect for both office and casual outings.',
      isLatest: true,
      stock: 15,
      rating: 4.5,
      reviewsCount: 8
    },
    {
      id: '10',
      name: 'Men Denim Jacket',
      price: 1499,
      originalPrice: 2499,
      discount: 40,
      category: 'Men',
      image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=100&w=2600&auto=format&fit=crop',
      images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=100&w=2600&auto=format&fit=crop'],
      description: 'Premium denim jacket with a rugged look and comfortable fit.',
      isFeatured: true,
      isLatest: true,
      stock: 12,
      rating: 4.7,
      reviewsCount: 5
    }
  ];

  // PRODUCT MANAGEMENT
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/admin/products", (req, res) => {
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    res.json({ success: true, product: newProduct });
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== id);
    res.json({ success: true, message: "Product deleted" });
  });

  // In-memory storage for orders (will be replaced by Firestore)
  let orders: any[] = [
    { id: '1289', customerName: 'Priya Sharma', phone: '9876543210', address: 'Mumbai, MH', total: 1599, status: 'Shipped', createdAt: new Date().toISOString() },
    { id: '1288', customerName: 'Anjali Gupta', phone: '9876543211', address: 'Delhi, DL', total: 2499, status: 'Packed', createdAt: new Date().toISOString() },
    { id: '1287', customerName: 'Sonia Verma', phone: '9876543212', address: 'Bangalore, KA', total: 899, status: 'Delivered', createdAt: new Date().toISOString() },
  ];

  // ORDER MANAGEMENT
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const newOrder = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      ...req.body,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    res.json(newOrder);
  });

  app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    orders = orders.map(o => o.id === id ? { ...o, status } : o);
    const updatedOrder = orders.find(o => o.id === id);
    res.json(updatedOrder);
  });

  // ANALYTICS (ADMIN)
  app.get("/api/admin/analytics", (req, res) => {
    // Daily, Weekly, Monthly revenue logic
    res.json({
      revenue: {
        daily: 4500,
        weekly: 32000,
        monthly: 125000
      },
      topProductsTotal: 12,
      lowStockCount: 3
    });
  });

  // COUPON VALIDATION
  app.post("/api/validate-coupon", (req, res) => {
    const { code, cartTotal } = req.body;
    // This will be connected to Firestore later
    res.json({ valid: false, message: "Coupon system initializing..." });
  });

  // Example Sales Analytics Route (Protected)
  app.get("/api/admin/analytics", (req, res) => {
    // Admin check will be added with Firebase Auth
    res.json({
      dailyRevenue: 12500,
      totalOrders: 45,
      topProducts: ["Floral Midi", "Sequin Gown"]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
