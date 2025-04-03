import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 질병 목록 로드
export const loadDiseases = createAsyncThunk('diseases/loadDiseases', async () => {
  try {
    const response = await axios.get('/api/diseases/processed');
    return response.data; // API에서 받아온 질병 데이터
  } catch (error) {
    console.error('질병 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const diseaseSlice = createSlice({
  name: 'diseases',
  initialState: {
    diseases: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDiseases.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDiseases.fulfilled, (state, action) => {
        state.diseases = action.payload;
        state.loading = false;
      })
      .addCase(loadDiseases.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default diseaseSlice.reducer;
