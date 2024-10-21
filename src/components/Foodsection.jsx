import React from 'react';
import Card from './Card';

const FoodSection = ({ categoryName, products }) => {
    return (
        <div className="my-4">
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '20px' }}>
                {categoryName}
            </h2>
            <div className="row">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className="col-12 col-md-6 col-lg-3">
                            <Card 
                                options={product.options[0]} // Adjust as needed based on your data structure
                                item={product} 
                                ImgSrc={product.img} 
                                foodName={product.name} 
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p style={{ color: 'white' }}>No products available in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodSection;
