import React, { useReducer, useContext, createContext, useEffect } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return [
                ...state,
                {
                    id: action.id,
                    name: action.name,
                    qty: action.qty,
                    size: action.size,
                    price: action.price,
                    img: action.img
                }
            ];
        case "REMOVE":
            return state.filter((_, index) => index !== action.index);
        case "DROP":
            return []; // Clear the cart
        case "UPDATE": {
            return state.map((food) =>
                food.id === action.id
                    ? { ...food, qty: food.qty + parseInt(action.qty), price: action.price + food.price }
                    : food
            );
        }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
