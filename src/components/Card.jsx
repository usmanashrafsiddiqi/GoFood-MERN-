import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
    const data = useCart();
    const navigate = useNavigate();
    const [state, setState] = useState({ qty: 1, size: "" });
    const priceRef = useRef();
    const { options, item: foodItem, ImgSrc, foodName } = props;
    const priceOptions = Object.keys(options);
    const dispatch = useDispatchCart();

    useEffect(() => {
        if (priceOptions.length > 0) {
            setState(prev => ({ ...prev, size: priceOptions[0] })); // Set default size
        }
    }, [priceOptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent navigating
        const { qty, size } = state;
        const price = options[size] ? parseFloat(options[size]) : 0;
        const finalPrice = qty * price;

        const existingFood = data.find(item => item.id === foodItem._id);

        if (existingFood) {
            if (existingFood.size === size) {
                dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty });
            } else {
                dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty, size, img: ImgSrc });
            }
        } else {
            dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty, size, img: ImgSrc });
        }
    };

    const handleCardClick = () => {
        navigate(`/food/${foodItem._id}`); // Navigate to the detailed view
    };

    const price = options[state.size] ? parseFloat(options[state.size]) : 0;
    const totalPrice = state.qty * price;

    return (
        <div className="card mt-3" style={{ width: "16rem", maxHeight: "400px", display: "flex", flexDirection: "column" }} onClick={handleCardClick}>
            <img src={ImgSrc} className="card-img-top" alt={foodName} style={{ height: "120px", objectFit: "cover" }} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{foodName}</h5>
                <div className='d-flex justify-content-between align-items-center'>
                    <select 
                        className="m-2 bg-success text-black rounded" 
                        name="qty" 
                        onChange={(e) => { e.stopPropagation(); handleChange(e); }} // Prevent click event
                        value={state.qty}
                    >
                        {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                    <select 
                        className="m-2 bg-success text-black rounded" 
                        ref={priceRef} 
                        name="size" 
                        onChange={(e) => { e.stopPropagation(); handleChange(e); }} // Prevent click event
                        value={state.size}
                    >
                        {priceOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <div className='fs-5'>
                        ₹{isNaN(totalPrice) ? 0 : totalPrice.toFixed(2)}/-
                    </div>
                </div>
                <button className="btn btn-success mt-3" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
