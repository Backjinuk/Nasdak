import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormControlLabel, Grid, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { jsonHeader } from 'headers';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch } from 'app/hooks';
import { axiosSendEmail, axiosSendPhone, axiosVerifyEmail, axiosVerifyPhone } from 'app/slices/userSlice';
import Timer from 'Timer';

const steps = ['아이디 찾기', '아이디 확인', '비밀번호 변경', '완료'];
const noUser = 'there is no user';

export default function FindUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [auth, setAuth] = useState(initialAuth);
  const [radio, setRadio] = useState('email');
  const [userId, setUserId] = useState('');
  const [userNo, setUserNo] = useState('');
  const handleNext = () => {
    setStep(step + 1);
  };
  const handleReset = () => {
    setStep(0);
  };

  function getStep(step: number) {
    switch (step) {
      case 0:
        return (
          <StepOne
            auth={auth}
            setAuth={setAuth}
            radio={radio}
            setRadio={setRadio}
            handleNext={handleNext}
            setUserId={setUserId}
          />
        );
      case 1:
        return (
          <StepTwo
            handleReset={handleReset}
            userId={userId}
            auth={auth}
            radio={radio}
            handleNext={handleNext}
            navigate={navigate}
            setUserNo={setUserNo}
          />
        );
      case 2:
        return <StepThree userNo={userNo} handleNext={handleNext} />;
      case 3:
        return <StepFour navigate={navigate} />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position='absolute'
        color='default'
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant='h6' color='inherit' noWrap>
            Nasdak
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
        <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component='h1' variant='h4' align='center'>
            {steps[step]}
          </Typography>
          {getStep(step)}
        </Paper>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}

function StepOne(props: any) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState('');
  const [code, setCode] = useState('');
  const [onTimer, setOnTimer] = useState(0);
  const [viewTime, setViewTime] = useState('');

  const auth = props.auth;
  const radio = props.radio;
  const setAuth = (data: any) => {
    setCode('');
    setStatus('');
    setOnTimer(0);
    props.setAuth(data);
  };
  const setRadio = (e: any) => {
    setAuth({
      email: '',
      phone: '',
    });
    setCode('');
    setStatus('');
    setOnTimer(0);
    props.setRadio(e);
  };
  const handleNext = () => {
    props.handleNext();
    setOnTimer(0);
  };
  const setUserId = (userId: string) => {
    props.setUserId(userId);
  };

  async function handleFind() {
    let data;
    if (radio === 'email') {
      data = { email: auth.email };
    } else {
      data = { phone: auth.phone };
    }
    try {
      const res = await axios.post('/api/user/findId', JSON.stringify(data), jsonHeader);
      setUserId(res.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setUserId(noUser);
      }
    }
    handleNext();
  }

  const sendEmail = () => {
    dispatch(axiosSendEmail(auth.email));
    setOnTimer(onTimer + 1);
    setStatus('sended');
  };

  const sendPhoneMessage = () => {
    dispatch(axiosSendPhone(auth.phone));
    setOnTimer(onTimer + 1);
    setStatus('sended');
  };

  const verifyAuth = async () => {
    let action;
    let data;
    if (radio === 'email') {
      data = { email: auth.email, code };
      action = await dispatch(axiosVerifyEmail(data));
    } else {
      data = { phone: auth.phone, code };
      action = await dispatch(axiosVerifyPhone(data));
    }
    if (action.payload) {
      setStatus('succeeded');
      alert('인증에 성공했습니다.');
      setOnTimer(0);
    } else {
      alert('인증에 실패했습니다.');
    }
  };

  return (
    <>
      <Timer setViewTime={setViewTime} onTimer={onTimer} setOnTimer={setOnTimer} duration={5} type='분' />
      <FormControl>
        <RadioGroup
          defaultValue='email'
          name='radio-buttons-group'
          row={true}
          value={radio}
          onChange={(e) => {
            setRadio(e.target.value);
            setAuth(initialAuth);
          }}
        >
          <FormControlLabel value='email' control={<Radio />} label='이메일로 찾기' />
          <FormControlLabel value='phone' control={<Radio />} label='휴대폰으로 찾기' />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {radio === 'email' ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                value={auth.email}
                onChange={(e) => {
                  setAuth({
                    ...auth,
                    [e.target.name]: e.target.value,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button onClick={sendEmail} variant='contained' endIcon={<SendIcon />}>
                        인증코드 전송
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='phone'
                label='Phone Number'
                name='phone'
                value={auth.phone}
                onChange={(e) => {
                  setAuth({
                    ...auth,
                    [e.target.name]: e.target.value,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button onClick={sendPhoneMessage} variant='contained' endIcon={<SendIcon />}>
                        인증코드 전송
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {status === 'sended' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='code'
                label={`인증코드 ${viewTime}`}
                name='code'
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button onClick={verifyAuth} variant='contained' endIcon={<SendIcon />}>
                        확인
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <React.Fragment>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {status === 'succeeded' ? (
            <Button
              variant='contained'
              onClick={() => {
                handleFind();
              }}
              sx={{ mt: 3, ml: 1 }}
            >
              검색
            </Button>
          ) : (
            <Button disabled variant='contained' sx={{ mt: 3, ml: 1 }}>
              검색
            </Button>
          )}
        </Box>
      </React.Fragment>
    </>
  );
}

function StepTwo(props: any) {
  const userId = props.userId;
  const isUser = userId !== noUser;
  const navigate = props.navigate;
  const radio = props.radio;
  const auth = props.auth;
  const setUserNo = (val: any) => {
    props.setUserNo(val);
  };
  const handleReset = () => {
    props.handleReset();
  };
  const handleNext = async () => {
    let data;
    if (radio === 'email') {
      data = { email: auth.email };
    } else {
      data = { phone: auth.phone };
    }
    const res = await axios.post('/api/user/findPassword', JSON.stringify({ ...data, userId: userId }), jsonHeader);
    setUserNo(res.data);
    props.handleNext();
  };
  return (
    <>
      <React.Fragment>
        <Typography component='h1' variant='h6' align='center'>
          <p></p>
          {isUser ? `아이디는 '${userId}'입니다.` : '해당하는 회원이 없습니다.'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isUser ? (
            <Button
              variant='contained'
              onClick={() => {
                handleNext();
              }}
              sx={{ mt: 3, ml: 1 }}
            >
              비밀번호 변경하기
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={() => {
                handleReset();
              }}
              sx={{ mt: 3, ml: 1 }}
            >
              아이디 찾기
            </Button>
          )}
          <Button
            variant='contained'
            onClick={() => {
              navigate('/');
            }}
            sx={{ mt: 3, ml: 1 }}
          >
            {isUser ? '로그인하기' : '회원가입하기'}
          </Button>
        </Box>
      </React.Fragment>
    </>
  );
}

function StepThree(props: any) {
  const userNo = props.userNo;
  const [password, setPassword] = useState('');
  const handleNext = () => {
    props.handleNext();
  };

  function handleChange() {
    const data = {
      userNo: userNo,
      password: password,
    };
    axios.post('/api/user/updatePassword', JSON.stringify(data), jsonHeader).then((res) => {
      handleNext();
    });
  }

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id='password'
              label='Password'
              name='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <React.Fragment>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            onClick={() => {
              handleChange();
            }}
            sx={{ mt: 3, ml: 1 }}
          >
            변경
          </Button>
        </Box>
      </React.Fragment>
    </>
  );
}

function StepFour(props: any) {
  const navigate = props.navigate;
  return (
    <>
      <React.Fragment>
        <Typography component='h1' variant='h6' align='center'>
          <p></p>
          비밀번호가 변경되었습니다.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            onClick={() => {
              navigate('/');
            }}
            sx={{ mt: 3, ml: 1 }}
          >
            로그인하기
          </Button>
        </Box>
      </React.Fragment>
    </>
  );
}

const initialAuth = {
  email: '',
  phone: '',
};

function Copyright() {
  const navigate = useNavigate();
  return (
    <Typography variant='body2' color='text.secondary' align='center'>
      {'Copyright © '}
      <Link
        color='inherit'
        href='https://localhost:3000/'
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
