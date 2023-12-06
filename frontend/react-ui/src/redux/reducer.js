import { createSlice, createSelector } from '@reduxjs/toolkit'
import { initialState } from "./initialState";

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    createProduct(state, action) {
      const newProduct = action.payload;
      const ids = state.products.map(product => product.id);
      const newId = Math.max(...ids) + 1;
      state.products.push({id: newId, ...newProduct});
    },
    updateProduct(state, action) {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(product => product.id === updatedProduct.id);
      state.products.splice(index, 1, updatedProduct);
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      const index = state.products.findIndex(product => product.id === id);
      state.products.splice(index, 1);
    },
  }
});

export const { createProduct, updateProduct, deleteProduct } = productSlice.actions;

export default productSlice.reducer;

const selectState = (state) => state;

const selectProducts = createSelector(
  selectState,
  (state) => [...state.products.products].sort((p1, p2) => p2.id - p1.id)
);

const selectProductsById = (id) => {
  return createSelector(
    selectProducts,
    (products) => products.find(product => product.id === id)
  );
};

const selectCategories = createSelector(
  selectProducts,
  (products) => Array.from(new Set(products.map(product => product.category).sort()))
);

export { selectProducts, selectProductsById, selectCategories };
