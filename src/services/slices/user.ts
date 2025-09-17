import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { UserProfile } from '@utils-types';

// Состояние пользователя и аутентификации
export type UserState = {
  user: UserProfile | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// Регистрация нового пользователя
export const registerNewUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

// Вход пользователя
export const signInUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

// Выход пользователя
export const signOutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Получение данных пользователя
export const loadUserData = createAsyncThunk('user/fetch', async () => {
  const response = await getUserApi();
  return response.user;
});

// Обновление данных пользователя
export const updateUserData = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthStatus(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerNewUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при регистрации';
      })
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        signInUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при входе';
      })
      .addCase(loadUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadUserData.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(loadUserData.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state) => {
        // Даже если API вызова не удался, очищаем локальные данные
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  }
});

export const { setAuthStatus } = userSlice.actions;
export default userSlice.reducer;
