import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션: 병원 목록 로드
export const loadHospitals = createAsyncThunk('hospitals/loadHospitals', async () => {
  try {
    const response = await axios.get('/api/hospitals');
    return response.data; // API에서 받아온 병원 데이터
  } catch (error) {
    console.error('병원 로딩 실패:', error);
    throw error;
  }
});

// slice 생성
const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState: {
    hospitals: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload;
        state.loading = false;
      })
      .addCase(loadHospitals.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default hospitalSlice.reducer;
