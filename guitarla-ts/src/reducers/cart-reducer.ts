import type {CartItem, Guitar} from "../types";
import {db} from "../data/db.ts";

export type CartActions =
    { type: 'add-to-cart', payload: {item: Guitar}} |
    { type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} |
    { type: 'clear-cart'}

export type CartState = {
    data: Guitar[],
    cart: CartItem[],
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
}

export const initialState: CartState = {
    data: db,
    cart: initialCart(),
}

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (state: CartState, action: CartActions) => {
    if(action.type === 'add-to-cart'){
        const itemExist = state.cart.find(guitar => guitar.id === action.payload.item.id);
        let updateCart: CartItem[] = [];

        if (itemExist) {
            updateCart = state.cart.map(item => {
                if(item.id === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS) {
                        return {...item, quantity: item.quantity + 1};
                    } else {
                        return item
                    }
                } else {
                    return item;
                }
            })
        } else {
            const newItem : CartItem = {...action.payload.item, quantity: 1};
            updateCart = [...state.cart, newItem]
        }

        return {
            ...state,
            cart: updateCart
        }
    }
    if(action.type === 'remove-from-cart'){

        const updateCart = state.cart.filter(item => item.id !== action.payload.id);
        return {...state, cart: updateCart}
    }
    if(action.type === 'increase-quantity'){
        const updateCart = state.cart.map(item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }else {
                return item;
            }


        })
        return {...state, cart: updateCart}
    }
    if(action.type === 'decrease-quantity'){
        const updateCart = state.cart.map((item) => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1};
            }else {
                return item;
            }
        });

        return {...state, cart: updateCart}
    }
    if(action.type === 'clear-cart'){
        return {...state, cart: []}
    }

    return state;
}