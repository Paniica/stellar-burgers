import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { signOutUser } from '@slices/user';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // При клике — выхожу из системы и очищаю токены
  const handleLogout = async () => {
    try {
      await dispatch(signOutUser());
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // Даже если API вызова не удался, очищаем локальные данные и перенаправляем
      navigate('/', { replace: true });
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
