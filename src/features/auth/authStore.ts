import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getToken, getUserInfo } from './shared';

const initialState = {
  token: getToken(),
  userInfo: getUserInfo()
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    resetAuth: () => initialState,
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    setUserInfo: (state, { payload }: PayloadAction<Api.Auth.LoginUserInfo>) => {
      state.userInfo = payload;
    }
  },
  selectors: {
    selectToken: auth => auth.token,
    selectUserInfo: auth => auth.userInfo
  }
});

export const { resetAuth, setToken, setUserInfo } = authSlice.actions;

export const { selectToken, selectUserInfo } = authSlice.selectors;

// 判断用户是否已登录
export const getIsLogin = createSelector([selectToken], token => Boolean(token));
