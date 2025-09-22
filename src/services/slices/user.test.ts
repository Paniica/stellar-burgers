import userReducer, {
  registerNewUser,
  signInUser,
  signOutUser,
  loadUserData,
  updateUserData,
  setAuthStatus,
  UserState
} from './user';
import { UserProfile } from '@utils-types';

/**
 * Тесты для редьюсера пользователя
 * 
 * Проверяем обработку экшенов:
 * - Регистрация пользователя (pending, fulfilled, rejected)
 * - Вход пользователя (pending, fulfilled, rejected)
 * - Выход пользователя (fulfilled, rejected)
 * - Загрузка данных пользователя (pending, fulfilled, rejected)
 * - Обновление данных пользователя (pending, fulfilled, rejected)
 * - Установка статуса авторизации
 */
describe('user reducer', () => {
  const initialState: UserState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  // Моковые данные для тестов
  const mockUser: UserProfile = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockRegisterData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123'
  };

  const mockLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('registerNewUser', () => {
    it('должен установить isLoading в true при начале регистрации', () => {
      const action = registerNewUser.pending('', mockRegisterData);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
    });

    it('должен установить данные пользователя и isLoading в false при успешной регистрации', () => {
      const action = registerNewUser.fulfilled(mockUser, '', mockRegisterData);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.user).toEqual(mockUser);
    });

    it('должен установить ошибку и isLoading в false при ошибке регистрации', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = registerNewUser.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        mockRegisterData
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.user).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = registerNewUser.rejected(
        { name: 'Error' } as any,
        '',
        mockRegisterData
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка при регистрации');
      expect(newState.user).toBeNull();
    });
  });

  describe('signInUser', () => {
    it('должен установить isLoading в true при начале входа', () => {
      const action = signInUser.pending('', mockLoginData);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
    });

    it('должен установить данные пользователя и isLoading в false при успешном входе', () => {
      const action = signInUser.fulfilled(mockUser, '', mockLoginData);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.user).toEqual(mockUser);
    });

    it('должен установить ошибку и isLoading в false при ошибке входа', () => {
      const errorMessage = 'Ошибка входа';
      const action = signInUser.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        mockLoginData
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.user).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = signInUser.rejected(
        { name: 'Error' } as any,
        '',
        mockLoginData
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка при входе');
      expect(newState.user).toBeNull();
    });
  });

  describe('signOutUser', () => {
    it('должен очистить данные пользователя при успешном выходе', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      };
      
      const action = signOutUser.fulfilled(undefined, '');
      const newState = userReducer(stateWithUser, action);
      
      expect(newState.user).toBeNull();
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('должен очистить данные пользователя даже при ошибке выхода', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      };
      
      const action = signOutUser.rejected(
        { message: 'Ошибка выхода', name: 'Error' },
        ''
      );
      const newState = userReducer(stateWithUser, action);
      
      expect(newState.user).toBeNull();
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('loadUserData', () => {
    it('должен установить isLoading в true при начале загрузки данных пользователя', () => {
      const action = loadUserData.pending('', undefined);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
    });

    it('должен установить данные пользователя, isLoading в false и isAuthChecked в true при успешной загрузке', () => {
      const action = loadUserData.fulfilled(mockUser, '', undefined);
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
    });

    it('должен установить isAuthChecked в true и isLoading в false при ошибке загрузки', () => {
      const action = loadUserData.rejected(
        { message: 'Ошибка загрузки', name: 'Error' },
        '',
        undefined
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.user).toBeNull();
    });
  });

  describe('updateUserData', () => {
    it('должен установить isLoading в true при начале обновления данных пользователя', () => {
      const action = updateUserData.pending('', { name: 'New Name' });
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
    });

    it('должен обновить данные пользователя и isLoading в false при успешном обновлении', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      };
      
      const updatedUser: UserProfile = {
        ...mockUser,
        name: 'Updated Name'
      };
      
      const action = updateUserData.fulfilled(updatedUser, '', { name: 'Updated Name' });
      const newState = userReducer(stateWithUser, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.user).toEqual(updatedUser);
    });

    it('должен установить ошибку и isLoading в false при ошибке обновления', () => {
      const errorMessage = 'Ошибка обновления';
      const action = updateUserData.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        { name: 'New Name' }
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.user).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = updateUserData.rejected(
        { name: 'Error' } as any,
        '',
        { name: 'New Name' }
      );
      const newState = userReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка обновления данных');
      expect(newState.user).toBeNull();
    });
  });

  describe('setAuthStatus', () => {
    it('должен установить статус авторизации', () => {
      const action = setAuthStatus(true);
      const newState = userReducer(initialState, action);
      
      expect(newState.isAuthChecked).toBe(true);
    });

    it('должен сбросить статус авторизации', () => {
      const stateWithAuth: UserState = {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      };
      
      const action = setAuthStatus(false);
      const newState = userReducer(stateWithAuth, action);
      
      expect(newState.isAuthChecked).toBe(false);
    });
  });

  describe('комбинированные сценарии', () => {
    it('должен корректно обрабатывать последовательность: регистрация -> вход -> обновление -> выход', () => {
      let state = initialState;
      
      // Регистрация
      state = userReducer(state, registerNewUser.pending('', mockRegisterData));
      expect(state.isLoading).toBe(true);
      
      state = userReducer(state, registerNewUser.fulfilled(mockUser, '', mockRegisterData));
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      
      // Вход (должен заменить данные пользователя)
      const loginUser: UserProfile = { ...mockUser, name: 'Login User' };
      state = userReducer(state, signInUser.fulfilled(loginUser, '', mockLoginData));
      expect(state.user).toEqual(loginUser);
      
      // Обновление
      const updatedUser: UserProfile = { ...loginUser, name: 'Updated User' };
      state = userReducer(state, updateUserData.fulfilled(updatedUser, '', { name: 'Updated User' }));
      expect(state.user).toEqual(updatedUser);
      
      // Выход
      state = userReducer(state, signOutUser.fulfilled(undefined, ''));
      expect(state.user).toBeNull();
    });

    it('должен корректно обрабатывать ошибки в разных операциях', () => {
      let state = initialState;
      
      // Ошибка регистрации
      state = userReducer(state, registerNewUser.rejected(
        { message: 'Ошибка регистрации', name: 'Error' },
        '',
        mockRegisterData
      ));
      expect(state.error).toBe('Ошибка регистрации');
      
      // Ошибка входа (должна заменить предыдущую ошибку)
      state = userReducer(state, signInUser.rejected(
        { message: 'Ошибка входа', name: 'Error' },
        '',
        mockLoginData
      ));
      expect(state.error).toBe('Ошибка входа');
    });
  });
});

