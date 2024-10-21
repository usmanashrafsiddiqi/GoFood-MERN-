import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
    const data = useCart();
    const dispatch = useDispatchCart();

    if (data.length === 0) {
        return (
            <div>
                <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
            </div>
        );
    }

    const handleCheckOut = async () => {
        const userEmail = localStorage.getItem("userEmail");

        try {
            const response = await fetch("http://localhost:5001/api/auth/orderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_data: data,
                    email: userEmail,
                    order_date: new Date().toDateString()
                })
            });

            if (response.ok) {
                dispatch({ type: "DROP" });
                alert('Order placed successfully!');
            } else {
                console.error("Failed to check out", response.status);
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert('An error occurred. Please try again.');
        }
    };

    const totalPrice = data.reduce((total, food) => total + food.price, 0);

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa' }}>
            {/* Adding a wrapper with extra top margin */}
            <div style={{ marginTop: '100px' }} className='container m-auto table-responsive'>
                <table className='table table-hover'>
                    <thead className='text-success fs-4'>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Size</th>
                            <th scope='col'>Amount</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((food, index) => (
                            <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{food.name}</td>
                                <td>{food.qty}</td>
                                <td>{food.size}</td>
                                <td>{food.price}</td>
                                <td>
                                    <button type="button" className="btn p-0" onClick={() => dispatch({ type: "REMOVE", index })}>
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h1 className='fs-2 text-white'>Total Price: {totalPrice}/-</h1>
                </div>
                <div>
                    <button className='btn bg-success mt-5' onClick={handleCheckOut}>Check Out</button>
                </div>
            </div>
        </div>
    );
}
