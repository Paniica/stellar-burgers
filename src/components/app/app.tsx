import '../../index.css';
import styles from './app.module.css';

import { AppHeader, ProtectedRoute } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { loadIngredients } from '@slices/ingredients';
import { loadUserData, setAuthStatus } from '@slices/user';

/**
 * Главный компонент приложения Stellar Burgers
 *
 * Этот компонент отвечает за:
 * - Инициализацию приложения (загрузка ингредиентов, проверка авторизации)
 * - Настройку маршрутизации между страницами
 * - Обработку модальных окон с деталями ингредиентов и заказов
 * - Защиту приватных маршрутов через ProtectedRoute
 *
 * Особенности архитектуры:
 * - Использует React Router для навигации
 * - Поддерживает модальные окна через background location
 * - Интегрирован с Redux для управления состоянием
 */
const App = () => {
  // Инициализация приложения - получаем необходимые хуки и данные
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: any } | undefined;

  useEffect(() => {
    // Загружаем ингредиенты и проверяем авторизацию
    dispatch(loadIngredients());
    dispatch(loadUserData()).finally(() => dispatch(setAuthStatus(true)));
  }, [dispatch]);

  // Обработчик закрытия модального окна
  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.mainApp}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
