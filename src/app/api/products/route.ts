import { NextResponse } from 'next/server';
import { db, Product } from '@/lib/db';

export async function GET() {
    const products = db.products.getAll();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        // For Vercel/serverless compatibility, do not write files
        // Use a placeholder image path or store base64 in memory if needed
        const imagePath = '/placeholder.png';

        const newProduct: Product = {
            id: formData.get('id') as string || Math.floor(Math.random() * 1000000).toString(),
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            buyingPrice: Number(formData.get('buyingPrice')),
            quantity: Number(formData.get('quantity')),
            unit: formData.get('unit') as string,
            thresholdValue: Number(formData.get('thresholdValue')),
            expiryDate: formData.get('expiryDate') as string,
            availability: formData.get('availability') as 'In-stock' | 'Out of stock' | 'Low stock',
            image: imagePath,
        };

        const createdProduct = db.products.add(newProduct);
        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
