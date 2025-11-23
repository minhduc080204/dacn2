import {AppStateType} from '../../types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
};

// const userSlice = createSlice({
//   name: 'appState',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<AppStateType['user']>) => {
//       state.user = action.payload;
//     },
//   },
// });

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
