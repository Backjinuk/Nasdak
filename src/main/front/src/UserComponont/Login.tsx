import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Join from './Join';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { getCookie, setCookie } from 'Cookies';
import { handleSNSLogin, setSnsState } from 'UserComponont/js/snsLogin';
import { useEffect, useState } from 'react';
import { UserType } from 'TypeList';
import ConnectToExistUserDialog from './ConnectToExistUserDialog';
import axios from 'customFunction/customAxios';
import { useAppDispatch } from 'app/hooks';
import { axiosLogin, login } from 'app/slices/userSlice';
declare global {
  interface Window {
    loginNavigate?: any;
    setExistUsers?: any;
    handleOpenExistUsers?: any;
    setSnsKey?: any;
  }
}

export default function Login() {
  const dispatch = useAppDispatch();

  const [id, setId] = useState(getCookie('userId') === undefined ? '' : getCookie('userId'));
  const [pwd, setPwd] = useState('');
  const [open, setOpen] = useState('');
  const [remember, setRemember] = useState(Boolean(getCookie('remember') === null ? false : getCookie('remember')));
  const [existUsers, setExistUsers] = useState<UserType[]>();
  const [snsKey, setSnsKey] = useState('');
  const handleOpen = () => setOpen('join');
  const handleOpenExistUsers = () => setOpen('connectToExistUserDialog');
  const handleClose = () => setOpen('');
  const navigate = useNavigate();
  window.setExistUsers = setExistUsers;
  window.handleOpenExistUsers = handleOpenExistUsers;
  window.setSnsKey = setSnsKey;

  useEffect(() => {
    setSnsState('login');
  }, []);

  const sty: any = {
    borderRadius: '5px',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    width: '500px',
    alignContent: 'center',
    padding: '15px',
    position: 'absolute',
    top: '50%',
    left: '18%',
    transform: 'translate(50%, -50%)',
  };

  const LoginMember = async () => {
    try {
      const action = await dispatch(axiosLogin({ userId: id, password: pwd }));
      Swal.fire({
        icon: 'success',
        title: '로그인 되었습니다.',
        timer: 1000,
      });

      if (remember) {
        setCookie('userId', id, { maxAge: 60 * 60 * 24 * 30 });
      } else {
        setCookie('userId', '', { maxAge: 0 });
      }
      const data = action.payload;
      loginNavigate(data.accessToken, data.refreshToken, data.accessTokenExpiresIn, data.refreshTokenExpiresIn);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '아이디 혹은 비밀번호를 다시 확인해주세요.',
      });
      return;
    }
  };

  function handleRemember(e: any) {
    setRemember(e.target.checked);
    setCookie('remember', e.target.checked, { maxAge: 60 * 60 * 24 * 30 });
  }

  const loginNavigate = (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: string,
    refreshTokenExpiresIn: string
  ) => {
    dispatch(login({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn }));
    navigate('/ledger');
  };

  // sns 로그인 후 세션 저장
  window.loginNavigate = loginNavigate;

  return (
    <>
      <div className={'text-center shadow-lg'} style={sty}>
        <div className='form-signin w-100 m-auto'>
          <h1 className='h3 mb-3 fw-normal'>Please sign in</h1>

          <div className='form-floating'>
            <input
              type='email'
              className='form-control'
              id='floatingInput'
              value={id}
              placeholder='name@example.com'
              onChange={(e) => setId(e.target.value)}
            />
            <label htmlFor='floatingInput'>Email address</label>
          </div>
          <div className='form-floating'>
            <input
              type='password'
              className='form-control pwd'
              id='floatingPassword'
              value={pwd}
              placeholder='Password'
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  LoginMember();
                }
              }}
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                value='remember'
                checked={remember}
                onChange={(e) => {
                  handleRemember(e);
                }}
                color='primary'
              />
            }
            label='Remember me'
          />
          <Button className='w-100 btn btn-lg btn-primary mb-2' type='submit' onClick={LoginMember}>
            로그인
          </Button>
          <Button className='w-100 btn btn-lg btn-info' onClick={handleOpen}>
            회원 가입
          </Button>
          <Button
            className='w-100 btn btn-lg btn-primary mb-2'
            onClick={() => {
              navigate('/findId');
            }}
          >
            아이디 찾기
          </Button>
          <IconButton className='w-50' onClick={() => handleSNSLogin('naver')}>
            <img style={{ width: '100%' }} src='/image/loginImage/btnG_완성형.png' alt='네이버로그인' />
          </IconButton>
          <IconButton className='w-50' onClick={() => handleSNSLogin('kakao')}>
            <img style={{ width: '100%' }} src='/image/loginImage/kakao_login_large_narrow.png' alt='카카오로그인' />
          </IconButton>
        </div>
      </div>

      <Join open={open === 'join'} handleClose={handleClose} />
      <ConnectToExistUserDialog
        open={open === 'connectToExistUserDialog'}
        handleClose={handleClose}
        existUsers={existUsers}
        snsKey={snsKey}
        loginNavigate={loginNavigate}
      />
      <Button
        onClick={async () => {
          const res = await axios.post('/api/token/test', JSON.stringify({ userNo: 1 }));
          console.table(res.data);
        }}
      >
        test
      </Button>
      <Button
        onClick={() => {
          setCookie('accessToken', '', { maxAge: 0 });
        }}
      >
        remove AccessToken
      </Button>
    </>
  );
}
