import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';


export default function MyOrder() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch the user's order data
    const fetchMyOrder = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) return; // Exit if no email is found

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/myOrderData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order data');
            }

            const data = await response.json();
            setOrderData(data.orderData); // Ensure this matches your API response structure
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><h5>Loading orders...</h5></div>;
    }

    if (error) {
        return <div className="text-center mt-5"><h5>Error: {error}</h5></div>;
    }

    return (
        <div>
           
            <div className='container'>
                <div className='row'>
                    {orderData && orderData.order_data && orderData.order_data.length > 0 ? (
                        orderData.order_data.slice(0).reverse().map((orderGroup, index) => (
                            <div key={index} className='mb-4'>
                                {orderGroup[1] && (
                                    <div className='m-auto mt-5'>
                                        <h5>Order Date: {new Date(orderGroup[1]).toLocaleDateString()}</h5>
                                        <hr />
                                    </div>
                                )}
                                {orderGroup[0].map((item) => (
                                    <div key={item.id} className='col-12 col-md-6 col-lg-3'>
                                        <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                            <img src={item.img} className="card-img-top" alt={item.name} style={{ height: "120px", objectFit: "cover" }} />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.name}</h5>
                                                <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                    <span className='m-1'>{item.qty}</span>
                                                    <span className='m-1'>{item.size}</span>
                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                        ₹{item.price}/-
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-5">
                            <h5>No orders found.</h5>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
