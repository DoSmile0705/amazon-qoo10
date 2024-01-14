import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../constant";

export const getAllNgDatas = createAsyncThunk(
  "ngdata/getAllNgDatas",
  async (userId,thunkAPI) => {
    const {data:{ngdata}} = await axios.get(`${BASE_URL}/api/ngdata/${userId}`);
    return ngdata;
  }
);

export const addNg = createAsyncThunk(
  "ngdata/addNgData",
  async (data, thunkAPI) => {
    let {data:{result}} = await axios.post(`${BASE_URL}/api/ngdata`, data);
    return result;
  }
);
export const setstateNg = createAsyncThunk(
  "ngdata/useNg",
  async (data, thunkAPI) => {
    let {data:{ngdata}} = await axios.post(`${BASE_URL}/api/ngdata/useNg`, {data:data});
    return ngdata;
  }
)
export const deleteNgData = createAsyncThunk(
  "ngdata/deleteNg",
  async (data, thunkAPI) => {
    let {data:{ngdata}} = await axios.post(`${BASE_URL}/api/ngdata/deleteNg`, {data:data});
    return ngdata;
  }
)

const ngSlice = createSlice({
  name: "ng",
  initialState: {
    ngdatas: [],
    check:false,
  },
  reducers: {
    getNgDatas: (state, action) => {
      state.ngdatas = action.payload;
      state.loading = false;
    },
  },
  extraReducers: {
    [getAllNgDatas.pending]: (state) => {
      state.loading = true;
    },
    [getAllNgDatas.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.ngdatas = payload;
      state.containFilters = state.ngdatas.map((item) => true);
    },
    [getAllNgDatas.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [addNg.pending]: (state) => {
      state.loading = true;
      state.check = true;
    },
    [addNg.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.check = false;
      
    },
    [addNg.rejected]: (state, action) => {
      state.loading = false;
      state.check = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [setstateNg.pending]: (state) => {
      state.loading = true;
      state.check = true;
    },
    [setstateNg.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.check = false;
      state.ngdatas = payload;
      
    },
    [setstateNg.rejected]: (state, action) => {
      state.loading = false;
      state.check = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
    [deleteNgData.pending]: (state) => {
      state.loading = true;
      state.check = true;
    },
    [deleteNgData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.check = false;
      
    },
    [deleteNgData.rejected]: (state, action) => {
      state.loading = false;
      state.check = false;
      state.error = true;
      state.errMsg = action.error.message;
    },
  },
});
export const { getNgDatas } = ngSlice.actions;
export default ngSlice.reducer;
