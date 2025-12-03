// In-memory mock data only (no filesystem, no database)

export interface Product {
    id: string;
    name: string;
    category: string;
    buyingPrice: number;
    quantity: number;
    unit: string;
    thresholdValue: number;
    expiryDate: string;
    availability: 'In-stock' | 'Out of stock' | 'Low stock';
    image?: string;
}

export interface Order {
    id: string;
    exhibition: string;
    orderValue: number;
    quantity: number;
    unit: string;
    expectedDelivery: string;
    status: 'Delayed' | 'Received' | 'Returned' | 'Out for delivery' | 'Waiting for check';
}

export interface Exhibition {
    id: string;
    exhibitionId: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface ExhibitionProduct {
    id: string;
    exhibitionId: string;
    productId: string;
    quantity: number;
    price?: number;
    status: 'pending' | 'approved' | 'rejected';
    supplierId: string; // Assuming we have a way to identify suppliers, for now just a string
}

export interface ProductList {
    id: string;
    exhibitionId: string;
    supplierId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    totalQuantity: number;
}

export interface ProductListItem {
    id: string;
    productListId: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface Database {
    products: Product[];
    orders: Order[];
    exhibitions: Exhibition[];
    exhibitionProducts: ExhibitionProduct[];
    productLists: ProductList[];
    productListItems: ProductListItem[];
}
// Global, volatile memory store (resets on server restart)
const mem: Database = {
    products: [],
    orders: [],
    exhibitions: [],
    exhibitionProducts: [],
    productLists: [],
    productListItems: [],
};

export const db = {
    products: {
        getAll: () => mem.products,
        getById: (id: string) => mem.products.find((p) => p.id === id),
        add: (product: Product) => {
            mem.products.push(product);
            return product;
        },
        update: (id: string, updates: Partial<Product>) => {
            const index = mem.products.findIndex((p) => p.id === id);
            if (index === -1) return null;
            mem.products[index] = { ...mem.products[index], ...updates };
            return mem.products[index];
        },
        delete: (id: string) => {
            const index = mem.products.findIndex((p) => p.id === id);
            if (index === -1) return false;
            mem.products.splice(index, 1);
            return true;
        },
    },
    orders: {
        getAll: () => mem.orders,
        add: (order: Order) => {
            mem.orders.push(order);
            return order;
        },
    },
    exhibitions: {
        getAll: () => mem.exhibitions || [],
        getById: (id: string) => mem.exhibitions?.find((e) => e.id === id),
        add: (exhibition: Exhibition) => {
            mem.exhibitions.push(exhibition);
            return exhibition;
        },
    },
    exhibitionProducts: {
        getAll: () => mem.exhibitionProducts || [],
        getByExhibitionId: (exhibitionId: string) => mem.exhibitionProducts?.filter((ep) => ep.exhibitionId === exhibitionId) || [],
        add: (exhibitionProduct: ExhibitionProduct) => {
            mem.exhibitionProducts.push(exhibitionProduct);
            return exhibitionProduct;
        },
        update: (id: string, updates: Partial<ExhibitionProduct>) => {
            const index = mem.exhibitionProducts.findIndex((ep) => ep.id === id);
            if (index === -1) return null;
            mem.exhibitionProducts[index] = { ...mem.exhibitionProducts[index], ...updates };
            return mem.exhibitionProducts[index];
        }
    },
    productLists: {
        getAll: () => mem.productLists || [],
        getByExhibitionId: (exhibitionId: string) => mem.productLists?.filter((pl) => pl.exhibitionId === exhibitionId) || [],
        getById: (id: string) => mem.productLists?.find((pl) => pl.id === id),
        add: (productList: ProductList) => {
            mem.productLists.push(productList);
            return productList;
        },
        update: (id: string, updates: Partial<ProductList>) => {
            const index = mem.productLists.findIndex((pl) => pl.id === id);
            if (index === -1) return null;
            mem.productLists[index] = { ...mem.productLists[index], ...updates };
            return mem.productLists[index];
        }
    },
    productListItems: {
        getAll: () => mem.productListItems || [],
        getByProductListId: (productListId: string) => mem.productListItems?.filter((pli) => pli.productListId === productListId) || [],
        add: (item: ProductListItem) => {
            mem.productListItems.push(item);
            return item;
        },
        deleteByProductListId: (productListId: string) => {
            mem.productListItems = mem.productListItems.filter(item => item.productListId !== productListId);
        }
    }
};
