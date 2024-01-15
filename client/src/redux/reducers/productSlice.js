import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../constant";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (userId, thunkAPI) => {
    let {
      data: { products },
    } = await axios.get(`${BASE_URL}/api/products/`, {
      params: { userId: userId },
    });
    return products;
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, thunkAPI) => {
    const response = await axios.post(`${BASE_URL}/api/products/add`, data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (editedProduct, thunkAPI) => {
    const res = await axios.post(`${BASE_URL}/api/products`, editedProduct);
    return res.data;
  }
);
export const exhibitProducts = createAsyncThunk(
  "product/exhibitProducts",
  async (products, thunkAPI) => {
    const res = await axios.post(`${BASE_URL}/api/qoo10/exhibit`, products);
    return res.data;
  }
);
export const getQoo10Category = createAsyncThunk(
  "product/getQoo10Category",
  async (thunkAPI) => {
    let {
      data: { categories },
    } = await axios.get(`${BASE_URL}/api/qoo10/category`);
    return categories;
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

    getFilters: (state, action) => {
      // GET LIST OF ALL COLORS FROM PRODUCTS
      state.colors = Array.from(
        new Set(
          state.colors.concat.apply(
            [],
            (state.filteredProducts.length > 0
              ? state.filteredProducts
              : state.products
            ).map((item) => item.categories.at(-1).color)
          )
        )
      ).sort();
      // GET LIST OF ALL BRANDS/COMPANIES FROM PRODUCTS
      state.brands = Array.from(
        new Set(
          state.brands.concat.apply(
            [],
            (state.filteredProducts.length > 0
              ? state.filteredProducts
              : state.products
            ).map((item) => item.company)
          )
        )
      ).sort();
    },
    selectFilters: (state, action) => {
      state.filter = action.payload.filter;

      // return an array of true and false based on if the product contains a filter
      if (state.filter.color === "" && state.filter.company === "") {
        state.containFilters = (
          state.filteredProducts.length < 1
            ? state.products
            : state.filteredProducts
        ).map((item) => true);
      } else if (state.filter.company !== "" && state.filter.color === "") {
        state.containFilters = (
          state.filteredProducts.length < 1
            ? state.products
            : state.filteredProducts
        ).map((item) =>
          Object.entries(state.filter).every(([key, value]) =>
            item.company.includes(value)
          )
        );
      } else {
        state.containFilters = (
          state.filteredProducts.length < 1
            ? state.products
            : state.filteredProducts
        ).map((item) =>
          Object.entries(state.filter).every(([key, value]) =>
            (item.categories.at(-1)[key] || item[key]).includes(value)
          )
        );
      }
    },
    selectSort: (state, action) => {
      state.sort = action.payload.sort;
      let items =
        state.filteredProducts.length < 1
          ? state.products
          : state.filteredProducts;

      switch (action.payload.sort) {
        case "newest":
          items = (
            state.filteredProducts.length < 1
              ? state.products
              : state.filteredProducts
          ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "asc":
          items = (
            state.filteredProducts.length < 1
              ? state.products
              : state.filteredProducts
          ).sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case "desc":
          items = (
            state.filteredProducts.length < 1
              ? state.products
              : state.filteredProducts
          ).sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        default:
          // eslint-disable-next-line
          items = (
            state.filteredProducts.length < 1
              ? state.products
              : state.filteredProducts
          ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
      }
    },
  },
  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.loading = true;
    },
    [getAllProducts.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.products = payload;
      state.containFilters = state.products.map((item) => true);
    },
    [getAllProducts.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [getQoo10Category.pending]: (state, action) => {
      state.loading = true;
    },
    [getQoo10Category.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.qoo10categories = payload;
    },
    [getQoo10Category.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [addProduct.pending]: (state) => {
      state.loading = true;
    },
    [addProduct.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // payload values
      state.products.push(payload.product);
      state.title = payload.product.title;
      state.images = payload.product.img;
      state.description = payload.product.description;
      state.price = payload.product.price;
      state.income = payload.product.income;
      state.successMsg = payload.message;
    },
    [addProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [updateProduct.pending]: (state) => {
      state.uploading = true;
    },
    [updateProduct.fulfilled]: (state, { payload }) => {
      // state.loading = false;
      state.products.map((product, index) => {
        if (product._id === payload.product._id) {
          state.products[index] = payload.product;
        }
      });
      state.successMsg = payload.message;
      state.uploading = false;
    },
    [updateProduct.rejected]: (state, action) => {
      state.uploading = false;
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [exhibitProducts.pending]: (state) => {
      state.uploading = true;
      state.pro_error = false;
    },
    [exhibitProducts.fulfilled]: (state, { payload }) => {
      state.pro_error = false;
      state.uploading = false;
    },
    [exhibitProducts.rejected]: (state, action) => {
      state.uploading = false;
      state.pro_error = true;
      state.pro_errMsg = action.error.message;
    },
  },
});

export const { getProducts, setError } = productSlice.actions;
export default productSlice.reducer;
