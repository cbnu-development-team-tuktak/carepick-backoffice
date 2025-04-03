// src/store/hospitalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 병원 개수 로드
export const loadHospitalsCount = createAsyncThunk('hospitals/loadHospitalsCount', async () => {
  try {
    const response = await axios.get('/api/hospitals/count');
    return response.data.count;  // 병원 데이터 개수 반환
  } catch (error) {
    console.error('병원 개수 로딩 실패:', error);
    throw error;
  }
});

// 비동기 액션: 병원 목록 로드
export const loadHospitalsPage = createAsyncThunk('hospitals/loadHospitalsPage', async ({ page, size }) => {
  try {
    const response = await axios.get('/api/hospitals', {
      params: { page, size },
    });
    return response.data.content; // 병원 데이터 반환
  } catch (error) {
    console.error('병원 목록 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState: {
    hospitals: [],
    count: 0,        // 전체 병원 개수
    loading: false,  // 로딩 상태
    error: null,     // 에러 상태
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 병원 개수 로딩 상태 처리
      .addCase(loadHospitalsCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      
      // 병원 목록 로딩 상태 처리
      .addCase(loadHospitalsPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadHospitalsPage.fulfilled, (state, action) => {
        state.hospitals = action.payload;
        state.loading = false;
      })
      .addCase(loadHospitalsPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default hospitalSlice.reducer;
