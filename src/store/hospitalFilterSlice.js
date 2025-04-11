// src/store/hospitalFilterSlice.js

// Redux Toolkit에서 createSlice 함수 import
import { createSlice } from '@reduxjs/toolkit'; // Redux 상태 정의 및 리듀서 생성 도구

// 병원 정렬 및 필터 상태를 위한 초기값
const initialState = {
  sortOption: '거리순', // 기본 정렬 기준
  filters: {
    distance: 10, // 거리 범위 (단위: km)
    specialties: [], // 선택된 진료과 배열
    selectedDays: [], // 선택된 요일
    startTime: '', // 시작 시간 (HH:mm)
    endTime: '', // 종료 시간 (HH:mm)
    duration: '', // 시간 범위 (분 단위)
  },
};

// 병원 필터/정렬 관련 slice 정의
const hospitalFilterSlice = createSlice({
  name: 'hospitalFilter', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    // 정렬 기준 변경
    setSortOption(state, action) {
      state.sortOption = action.payload;
    },
    // 거리 필터 설정
    setDistance(state, action) {
      state.filters.distance = action.payload;
    },
    // 진료과 필터 설정
    setSpecialties(state, action) {
      state.filters.specialties = action.payload;
    },
    // 요일 설정
    setSelectedDays(state, action) {
      state.filters.selectedDays = action.payload;
    },
    // 시작 시간 설정
    setStartTime(state, action) {
      state.filters.startTime = action.payload;
    },
    // 종료 시간 설정
    setEndTime(state, action) {
      state.filters.endTime = action.payload;
    },
    // 시간 범위 설정
    setDuration(state, action) {
      state.filters.duration = action.payload;
    },
    // 필터 전체 초기화
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  },
});

// 액션과 리듀서 export
export const {
  setSortOption,
  setDistance,
  setSpecialties,
  setSelectedDays,
  setStartTime,
  setEndTime,
  setDuration,
  resetFilters
} = hospitalFilterSlice.actions;

export default hospitalFilterSlice.reducer;
