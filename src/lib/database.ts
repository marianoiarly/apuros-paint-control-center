// Mock JSON database for ApurosPDV
export interface Product {
  id: string;
  name: string;
  brand: string;
  color: string;
  category: string;
  unitOfMeasure: string;
  salePrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  createdAt: string;
}

export interface Service {
  id: string;
  client: string;
  serviceType: string;
  value: number;
  executionDate: string;
  responsible: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Sale {
  id: string;
  client: string;
  items: SaleItem[];
  total: number;
  discount: number;
  paymentMethod: string;
  status: 'completed' | 'cancelled' | 'pending';
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Mock data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tinta Acrílica Premium',
    brand: 'Suvinil',
    color: 'Branco Neve',
    category: 'Tintas',
    unitOfMeasure: 'Galão 3.6L',
    salePrice: 89.90,
    stock: 25,
    minStock: 5,
    supplier: 'Distribuidora Cores Ltda',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Tinta Látex Econômica',
    brand: 'Coral',
    color: 'Amarelo Canário',
    category: 'Tintas',
    unitOfMeasure: 'Lata 18L',
    salePrice: 125.50,
    stock: 3,
    minStock: 8,
    supplier: 'Tintas & Cores SA',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Verniz Marítimo',
    brand: 'Sherwin Williams',
    color: 'Incolor',
    category: 'Vernizes',
    unitOfMeasure: 'Galão 3.6L',
    salePrice: 156.80,
    stock: 12,
    minStock: 4,
    supplier: 'Import Tintas',
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'Primer Branco',
    brand: 'Eucatex',
    color: 'Branco',
    category: 'Primers',
    unitOfMeasure: 'Galão 3.6L',
    salePrice: 75.20,
    stock: 18,
    minStock: 6,
    supplier: 'Distribuidora Cores Ltda',
    createdAt: '2024-01-12'
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    client: 'João Silva',
    serviceType: 'Pintura Residencial',
    value: 850.00,
    executionDate: '2024-01-20',
    responsible: 'Carlos Pintor',
    status: 'completed',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    client: 'Maria Santos',
    serviceType: 'Textura Decorativa',
    value: 1200.00,
    executionDate: '2024-01-25',
    responsible: 'Ana Decoradora',
    status: 'in-progress',
    createdAt: '2024-01-18'
  }
];

export const MOCK_SALES: Sale[] = [
  {
    id: '1',
    client: 'Pedro Costa',
    items: [
      {
        productId: '1',
        productName: 'Tinta Acrílica Premium',
        quantity: 2,
        price: 89.90,
        subtotal: 179.80
      }
    ],
    total: 179.80,
    discount: 0,
    paymentMethod: 'Cartão',
    status: 'completed',
    createdAt: '2024-01-19'
  }
];

// Database operations
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem('apuros_products') || JSON.stringify(MOCK_PRODUCTS));
};

export const getServices = (): Service[] => {
  return JSON.parse(localStorage.getItem('apuros_services') || JSON.stringify(MOCK_SERVICES));
};

export const getSales = (): Sale[] => {
  return JSON.parse(localStorage.getItem('apuros_sales') || JSON.stringify(MOCK_SALES));
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem('apuros_products', JSON.stringify(products));
};

export const saveService = (service: Service): void => {
  const services = getServices();
  const existingIndex = services.findIndex(s => s.id === service.id);
  
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push(service);
  }
  
  localStorage.setItem('apuros_services', JSON.stringify(services));
};

export const saveSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem('apuros_sales', JSON.stringify(sales));
};

// Analytics
export const getDatabase = () => {
  const db = {
    products: JSON.parse(localStorage.getItem('apuros_products') || JSON.stringify(MOCK_PRODUCTS)),
    services: JSON.parse(localStorage.getItem('apuros_services') || JSON.stringify(MOCK_SERVICES)),
    sales: JSON.parse(localStorage.getItem('apuros_sales') || JSON.stringify(MOCK_SALES)),
    users: JSON.parse(localStorage.getItem('apuros_users') || '[]'),
    stockMovements: JSON.parse(localStorage.getItem('apuros_stock_movements') || '[]')
  };
  return db;
};

export const saveDatabase = (db: any) => {
  localStorage.setItem('apuros_products', JSON.stringify(db.products || []));
  localStorage.setItem('apuros_services', JSON.stringify(db.services || []));
  localStorage.setItem('apuros_sales', JSON.stringify(db.sales || []));
  localStorage.setItem('apuros_users', JSON.stringify(db.users || []));
  localStorage.setItem('apuros_stock_movements', JSON.stringify(db.stockMovements || []));
};

export const getDashboardStats = () => {
  const products = getProducts();
  const services = getServices();
  const sales = getSales();
  
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => sale.createdAt === today);
  const todayServices = services.filter(service => service.createdAt === today);
  
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  
  const dailySales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  
  return {
    dailySales,
    servicesCount: todayServices.length,
    lowStockCount: lowStockProducts.length,
    totalProducts: products.length
  };
};