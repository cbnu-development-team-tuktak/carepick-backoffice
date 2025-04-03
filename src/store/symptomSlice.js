// symptomSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 전체 증상 개수 로드
export const loadSymptomsCount = createAsyncThunk(
  'symptoms/loadSymptomsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/symptoms/count');
      return response.data.count;
    } catch (error) {
      console.error('증상 개수 로드 실패:', error);
      return rejectWithValue('로드 실패'); // 오류 발생 시 "로드 실패" 반환
    }
  }
);


// 증상 목록 로드 (페이지 단위)
export const loadSymptomsPage = createAsyncThunk(
  'symptoms/loadSymptomsPage',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/symptoms', { params: { page, size } });
      return response.data.content;  
    } catch (error) {
      return rejectWithValue('로드 실패');
    }
  }
);

const symptomSlice = createSlice({
  name: 'symptoms',
  initialState: {
    symptoms: [],
    count: 0,
    page: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSymptomsCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(loadSymptomsPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSymptomsPage.fulfilled, (state, action) => {
        state.symptoms = action.payload;
        state.loading = false;
      })
      .addCase(loadSymptomsPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '로드 실패';  // 기본 에러 메시지 처리
      });
  },
});

export default symptomSlice.reducer;
