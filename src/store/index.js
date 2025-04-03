import { configureStore } from '@reduxjs/toolkit';
import symptomsReducer from './symptomSlice';
import hospitalsReducer from './hospitalSlice';
import doctorsReducer from './doctorSlice';
import diseasesReducer from './diseaseSlice';

const store = configureStore({
  reducer: {
    symptoms: symptomsReducer,
    hospitals: hospitalsReducer,
    doctors: doctorsReducer,
    diseases: diseasesReducer,
  },
});

export { store };
