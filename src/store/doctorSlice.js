// src/store/doctorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 의사 개수 로드
export const loadDoctorsCount = createAsyncThunk('doctors/loadDoctorsCount', async () => {
  try {
    const response = await axios.get('/api/doctors/count');
    return response.data.count;  // 의사 데이터 개수 반환
  } catch (error) {
    console.error('의사 개수 로딩 실패:', error);
    throw error;
  }
});

// 비동기 액션: 의사 목록 로드
export const loadDoctorsPage = createAsyncThunk('doctors/loadDoctorsPage', async ({ page, size }) => {
  try {
    const response = await axios.get('/api/doctors', {
      params: { page, size },
    });
    return response.data.content;  // 의사 데이터 반환
  } catch (error) {
    console.error('의사 목록 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    count: 0,        // 전체 의사 개수
    loading: false,  // 로딩 상태
    error: null,     // 에러 상태
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 의사 개수 로딩 상태 처리
      .addCase(loadDoctorsCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      
      // 의사 목록 로딩 상태 처리
      .addCase(loadDoctorsPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDoctorsPage.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(loadDoctorsPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // 에러 상태 업데이트
      });
  },
});

export default doctorSlice.reducer;
