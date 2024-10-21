import React, { useEffect, useState } from 'react';
import FoodSection from './FoodSection';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                console.log("Fetched Products:", data); // Debugging
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;
    if (products.length === 0) return <div>No products available.</div>;

    const categories = [...new Set(products.map(product => product.CategoryName))];

    return (
        <div>
            {categories.map(category => (
                <FoodSection 
                    key={category} 
                    categoryName={category} 
                    products={products.filter(product => product.CategoryName === category)} 
                />
            ))}
        </div>
    );
};

export default ProductList;
