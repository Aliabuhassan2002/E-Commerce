import { createSlice } from "@reduxjs/toolkit";




const initialState = {
    count: 0,
    products: [],
    cart:[],
}


const ProductSlice = createSlice({

    name: 'product',
    initialState,
    reducers: {

        increment: (state, action) => {
            state.count += 1;
            state.cart.push(action.payload);
            
            // state.products.push(action.payload);


            // console.log(productss); // This will print the actual array contents

        },
        decrement: (state, action) => {
            state.count -= 1;
            // state.products.push(action.payload);


            // console.log(productss); // This will print the actual array contents

        },
        // deleteProduct: (state, action) => {

        //     state.products = state.products.filter((product) => product.id !== action.payload);
        //     state.count -= 1;
            

        // }



    }
});

export const { increment, decrement } = ProductSlice.actions;

export default ProductSlice.reducer;