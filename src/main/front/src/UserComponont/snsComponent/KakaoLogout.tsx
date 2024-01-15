import logout from 'UserComponont/js/logout';
import { useAppDispatch } from 'app/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window.Kakao.Auth.logout();
    logout(dispatch);
    navigate('/');
  });
  return <></>;
}
