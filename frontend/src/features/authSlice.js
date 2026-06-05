import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = JSON.parse(localStorage.getItem('threadgridUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      localStorage.setItem('threadgridUser', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('threadgridUser');
    }
  }
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
