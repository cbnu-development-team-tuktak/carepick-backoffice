// src/store/locationSlice.js

// Redux 상태 관리 및 비동기 작업을 위한 관련 import
import { createSlice } from '@reduxjs/toolkit'; // Redux Toolkit에서 slice를 생성하는 함수

// locationSlice 생성
const locationSlice = createSlice({
  name: 'location', // slice의 이름
  initialState: {
    lat: 36.6242237,  // 기본 위도 (청주)
    lng: 127.4614843, // 기본 경도 (청주)
    address: '충청북도 청주시 서원구 1순환로 776 (개신동)', // 기본 주소 (청주)
  },
  reducers: {
    // 위치 및 주소 업데이트 액션
    setLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.address = action.payload.address;
    },
    // 위치 초기화 (기본값으로 되돌리기)
    resetLocation: (state) => {
      state.lat = 36.6242237;
      state.lng = 127.4614843;
      state.address = '충청북도 청주시 서원구 1순환로 776 (개신동)';
    }
  }
});

// 액션 생성자 export
export const { setLocation, resetLocation } = locationSlice.actions;

// 리듀서 export
export default locationSlice.reducer;
