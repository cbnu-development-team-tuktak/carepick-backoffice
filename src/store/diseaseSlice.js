// src/store/diseaseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 질병 개수 로드
export const loadDiseasesCount = createAsyncThunk('diseases/loadDiseasesCount', async () => {
  try {
    const response = await axios.get('/api/diseases/processed/count');  // 질병 개수 엔드포인트
    return response.data.count; // API에서 받아온 질병 개수
  } catch (error) {
    console.error('질병 개수 로딩 실패:', error);
    throw error;
  }
});

// 비동기 액션: 질병 목록 로드 (페이지 단위)
export const loadDiseasesPage = createAsyncThunk('diseases/loadDiseasesPage', async ({ page, size }) => {
  try {
    const response = await axios.get('/api/diseases/processed', {  // processed 엔드포인트
      params: { page, size }
    });
    return response.data.content; // 질병 목록 반환
  } catch (error) {
    console.error('질병 목록 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const diseaseSlice = createSlice({
  name: 'diseases',
  initialState: {
    diseases: [],    // 질병 목록
    count: 0,        // 전체 질병 개수
    loading: false,  // 로딩 상태
    error: null,     // 에러 상태
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 질병 개수 로딩 상태 처리
      .addCase(loadDiseasesCount.fulfilled, (state, action) => {
        state.count = action.payload;  // 개수 저장
      })
      
      // 질병 목록 로딩 상태 처리
      .addCase(loadDiseasesPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDiseasesPage.fulfilled, (state, action) => {
        state.diseases = action.payload;  // 목록 저장
        state.loading = false;
      })
      .addCase(loadDiseasesPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // 에러 상태 설정
      });
  },
});

export default diseaseSlice.reducer;
