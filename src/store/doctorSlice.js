import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 의사 목록 로드
export const loadDoctors = createAsyncThunk('doctors/loadDoctors', async () => {
  try {
    const response = await axios.get('/api/doctors');
    return response.data; // API에서 받아온 의사 데이터
  } catch (error) {
    console.error('의사 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(loadDoctors.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default doctorSlice.reducer;
