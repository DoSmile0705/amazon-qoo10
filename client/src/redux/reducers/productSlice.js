import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../constant";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (userId, length, thunkAPI) => {
    let {
      data: { products },
    } = await axios.get(`/api/products/`, {
      params: { userId: userId, length: length },
    });
    return products;
  }
);

export const addProductByFile = createAsyncThunk(
  "product/addProductByFile",
  async (data, thunkAPI) => {
    const response = await axios.post(`/api/products/upload`, data);
    return response.data;
  }
);
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, thunkAPI) => {
    const response = await axios.post(`/api/products/add`, data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (editedProduct, thunkAPI) => {
    const res = await axios.post(`/api/products`, editedProduct);

    return res.data;
  }
);

export const exhibitProducts = createAsyncThunk(
  "product/exhibitProducts",
  async (products, thunkAPI) => {
    const res = await axios.post(`/api/qoo10/exhibit`, products);
    return res.data;
  }
);
export const getQoo10Category = createAsyncThunk(
  "product/getQoo10Category",
  async (thunkAPI) => {
    let {
      data: { categories },
    } = await axios.get(`/api/qoo10/category`);
    return categories;
  }
);
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (data, thunkAPI) => {
    const res = await axios.post(`/api/qoo10/`, data);
    return res.data;
  }
);
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    title: [],
    images: [],
    description: [],
    price: [],
    income: [],
    qoo10categories: [],
    successMsg: "",
    fileLength: 0,
    loadstate: 0,
    // each call +1, 2:end maininfo load, 4:ended price load, 6:ended category load
  },
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload.products;
      state.loading = false;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.payload.err;
    },
  },
  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.loading = true;
      state.successMsg = "";
    },
    [getAllProducts.fulfilled]: (state, { payload }) => {
      if (state.products.length == 0) {
        state.products = payload;
      } else {
        state.products.push(...payload.splice(state.products.length));
      }
      if (payload.length == 0 && state.fileLength == 0) {
        state.loading = false;
      }
      if (
        payload.length == 0 &&
        state.products.length > state.fileLength / 50
      ) {
        state.loadstate = state.loadstate + 1;
      }
      if (payload.length && state.fileLength > 0) {
        state.loadstate = 0;
      }
      if (payload.length && state.fileLength == 0) {
        state.loading = false;
      }
      if (state.loadstate == 5) {
        state.fileLength = 0;
        state.loading = false;
      }
    },
    [getAllProducts.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [getQoo10Category.pending]: (state, action) => {
      state.uploading = true;
    },
    [getQoo10Category.fulfilled]: (state, { payload }) => {
      state.uploading = false;
      state.qoo10categories = payload;
    },
    [getQoo10Category.rejected]: (state, action) => {
      state.uploading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [addProductByFile.pending]: (state) => {
      state.loading = true;
      state.uploading = true;
      state.fileLength = 0;
    },
    [addProductByFile.fulfilled]: (state, { payload }) => {
      state.products = payload.data;
      state.fileLength = state.products.length + payload.totalLength;
    },
    [addProductByFile.rejected]: (state) => {
      state.loading = false;
      state.uploading = false;
    },
    [addProduct.pending]: (state) => {
      state.loading = true;
    },
    [addProduct.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // payload values
      if (payload.product) {
        state.products.push(payload.product);
        state.title = payload.product.title;
        state.images = payload.product.img;
        state.description = payload.product.description;
        state.price = payload.product.price;
        state.income = payload.product.income;
        state.successMsg = payload.message;
      }
    },
    [addProduct.rejected]: (state, action) => {
      state.error = true;
      state.errMsg = action.error.message;
    },
    [updateProduct.pending]: (state) => {
      state.loading = true;
    },
    [updateProduct.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.products.map((product, index) => {
        if (product._id === payload.product._id) {
          state.products[index] = payload.product;
        }
      });
      state.successMsg = payload.message;
    },
    [updateProduct.rejected]: (state, action) => {
      state.uploading = false;
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [deleteProduct.pending]: (state) => {
      state.loading = true;
    },
    [deleteProduct.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.products = state.products.filter((product) => {
        return product._id !== payload._id;
      });
    },
    [deleteProduct.rejected]: (state, { payload }) => {
      state.loading = false;
      state.products = state.products.filter((product) => {
        return product._id !== payload;
      });
    },
    [exhibitProducts.pending]: (state) => {
      state.loading = true;
      state.pro_error = false;
    },
    [exhibitProducts.fulfilled]: (state, { payload }) => {
      state.pro_error = false;
      state.loading = false;
      state.error = false;
      payload.products?.map((pro, index) => {
        state.products.map((product, index) => {
          if (product._id === pro[0]._id && pro.status == "added") {
            state.products[index] = pro[0];
          } else if (product._id === pro[0]._id && pro.status == "failed") {
            state.products.splice(index, 1);
          }
        });
      });
    },
    [exhibitProducts.rejected]: (state, action) => {
      state.loading = false;
      state.pro_error = true;
      state.pro_errMsg = action.error.message;
    },
  },
});

export const { getProducts, setError } = productSlice.actions;
export default productSlice.reducer;
