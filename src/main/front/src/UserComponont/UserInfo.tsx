import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Badge, FormControlLabel, InputAdornment, Stack, Switch, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logout from 'UserComponont/js/logout';
import Join from './Join';
import { handleNaverLogin, handleKakaoLogin, setSnsState } from 'UserComponont/js/snsLogin';
import CategoryList from 'categoryComponent/CategortList';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  axiosDeleteUser,
  axiosDisconnectSns,
  axiosGetUser,
  axiosUpdateUser,
  disConnectSns,
  selectUser,
} from 'app/slices/userSlice';
import ChangeSnsDialog from './userInfo/ChangeSnsDialog';
import DisconnectSnsDialog from './userInfo/DisconnectSnsDialog';
import DeleteUserDialog from './userInfo/DeleteUserDialog';
import { Sns } from 'classes';
import ChangePasswordDialog from './userInfo/ChangePasswordDialog';
import ChangeEmailDialog from './userInfo/ChangeEmailDialog';
import ChangePhoneDialog from './userInfo/ChangePhoneDialog';

declare global {
  interface Window {
    handleChangeSnsDialogOpen?: any;
    dispatch?: any;
  }
}

export default function UserInfo() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const backup = useAppSelector(selectUser);
  const userStatus = useAppSelector((state) => state.user.status);
  const userNo = Number(sessionStorage.getItem('userNo'));

  const [user, setUser] = useState({ ...backup });
  const [snsSet, setSnsSet] = useState({ ...initialSnsSet });
  const [uploadFile, setUploadFile] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedSns, setSelectedSns] = useState('');

  const [open, setOpen] = useState('');
  const handleClose = () => setOpen('');
  const handleClickOpen = () => setOpen('deleteDialog');
  const handleSignUpOpen = () => setOpen('signUpDialog');
  const handleDisconnectSnsDialogOpen = (sns: string) => {
    setOpen('disconnectSnsDialog');
    setSelectedSns(sns);
  };
  const handleChangeSnsDialogOpen = () => setOpen('changeSnsDialog');

  const isSNS = user.userId === null;

  window.handleChangeSnsDialogOpen = handleChangeSnsDialogOpen;
  window.dispatch = dispatch;

  useEffect(() => {
    setSnsState('connect');
    if (userStatus === 'idle') {
      dispatch(axiosGetUser(userNo));
    }
  }, []);

  useEffect(() => {
    setUser({ ...backup });
    let nextSnsSet = { ...initialSnsSet };
    Object(backup).snsDtoList.forEach((sns: any) => {
      nextSnsSet = {
        ...nextSnsSet,
        [sns.snsType]: true,
      };
    });
    setSnsSet(nextSnsSet);
  }, [backup]);

  function handleChange(e: any) {
    if (e.target.type === 'checkbox') {
      setUser({
        ...user,
        [e.target.name]: e.target.checked,
      });
    } else {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  }

  function handleEdit(update: boolean) {
    if (update) {
      const existingFile = backup.profile;
      dispatch(axiosUpdateUser({ user, uploadFile, existingFile }));
      setUploadFile(undefined);
    } else {
      setUploadFile(undefined);
      setUser({ ...backup });
    }
    setIsEdit(false);
  }

  function handleDeleteProfile() {
    const nextUser = {
      ...user,
      profile: '',
    };
    setUser(nextUser);
  }

  async function deleteUser() {
    for (const sns of Object.entries(snsSet)) {
      if (sns[1]) {
        const res = await disconnectSns(sns[0]);
        if (res === false) {
          return;
        }
      }
    }

    await dispatch(axiosDeleteUser(userNo));
    logout(dispatch);
    navigate('/');
  }

  function connectSns(snsType: string) {
    setSelectedSns(snsType);
    switch (snsType) {
      case 'NAVER':
        handleNaverLogin();
        break;
      case 'KAKAO':
        handleKakaoLogin();
        break;
      case 'GOOGLE':
        break;
    }
  }

  async function disconnectSns(snsType: string) {
    const data = {
      userNo: user.userNo,
      accessToken: sessionStorage.getItem('accessToken'),
      snsType: snsType,
    };

    const action = await dispatch(axiosDisconnectSns(Sns.getByData(data)));

    if (action.payload) {
      dispatch(disConnectSns(snsType));
      handleClose();
      return true;
    } else {
      handleKakaoLogin();
      return false;
    }
  }

  const snsSignUp = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 3 }}>
      <Typography component='h1' variant='h6' sx={{ mr: 1 }}>
        {sessionStorage.getItem('snsType')}로 로그인한 계정입니다.
      </Typography>
      <Button variant='contained' onClick={handleSignUpOpen}>
        회원 가입
      </Button>
    </Box>
  );

  const userInfo = (
    <>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id='userId'
          label='userId'
          name='userId'
          value={user.userId}
          disabled={true}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          value={user.email === null ? '' : user.email}
          disabled
          InputProps={
            isEdit
              ? {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button
                        onClick={() => {
                          setOpen('changeEmailDialog');
                        }}
                        variant='contained'
                      >
                        {user.email === null ? '등록' : '변경'}
                      </Button>
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id='phone'
          label='Phone Number'
          name='phone'
          value={user.phone === null ? '' : user.phone}
          disabled
          InputProps={
            isEdit
              ? {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button
                        onClick={() => {
                          setOpen('changePhoneDialog');
                        }}
                        variant='contained'
                      >
                        {user.phone === null ? '등록' : '변경'}
                      </Button>
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          value={user.password}
          disabled
          InputProps={
            isEdit
              ? {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Button
                        onClick={() => {
                          setOpen('changePasswordDialog');
                        }}
                        variant='contained'
                      >
                        변경
                      </Button>
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      </Grid>
    </>
  );

  const userAvatar = (
    <Box>
      <Badge
        badgeContent={'X'}
        color='error'
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          handleDeleteProfile();
        }}
        invisible={!isEdit || user.profile === null || user.profile === ''}
      >
        <div
          style={{ cursor: 'default' }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {user.profile === null || user.profile === '' ? (
              <SentimentSatisfiedAltIcon />
            ) : (
              <img src={user.profile} alt={user.profile} width={'100%'} />
            )}
          </Avatar>
        </div>
      </Badge>
    </Box>
  );

  const integrationStyle = {
    cursor: 'pointer',
    borderRadius: '30%',
    width: 40,
    height: 40,
  };
  const snsConnection = (
    <Stack spacing={1}>
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>- sns 연동 -</div>
      <Stack direction='row' spacing={2} justifyContent='center'>
        {Object.entries(snsSet)
          .filter((sns) => sns[0] !== 'GOOGLE')
          .map((sns) => (
            <Tooltip key={sns[0]} title={sns[1] ? '연동해제' : '연동하기'} arrow>
              <Badge badgeContent={sns[1] ? 'OK' : 'X'} color={sns[1] ? 'success' : 'error'}>
                <img
                  style={integrationStyle}
                  src={snsImageLink[sns[0]]}
                  alt={sns[0].toLowerCase()}
                  onClick={
                    sns[1]
                      ? () => {
                          handleDisconnectSnsDialogOpen(sns[0]);
                        }
                      : () => {
                          connectSns(sns[0]);
                        }
                  }
                />
              </Badge>
            </Tooltip>
          ))}
      </Stack>
    </Stack>
  );

  const buttonGroup = (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <CategoryList />
      {isEdit ? (
        <>
          <Button
            variant='contained'
            onClick={() => {
              handleEdit(false);
            }}
            sx={{ ml: 1 }}
          >
            취소
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              handleEdit(true);
            }}
            sx={{ ml: 1 }}
          >
            완료
          </Button>
        </>
      ) : (
        <Button
          variant='contained'
          onClick={() => {
            setIsEdit(true);
          }}
          sx={{ ml: 1 }}
        >
          수정
        </Button>
      )}
      <Button
        variant='contained'
        onClick={() => {
          handleClickOpen();
        }}
        sx={{ ml: 1 }}
      >
        회원탈퇴
      </Button>
    </Box>
  );

  const infoBox = (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Grid container spacing={2}>
        {!isSNS && userInfo}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                disabled={!isEdit}
                checked={user.sendKakaoTalk}
                onChange={(e) => {
                  handleChange(e);
                }}
                name='sendKakaoTalk'
              />
            }
            label='카카오톡 알림 전송'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                disabled={!isEdit}
                checked={user.sendWebPush}
                onChange={(e) => {
                  handleChange(e);
                }}
                name='sendWebPush'
              />
            }
            label='웹 푸시 알림'
          />
        </Grid>
        {isEdit && (
          <Grid item xs={12}>
            <Button component='label' sx={{ width: '100%' }} variant='contained' startIcon={<CloudUploadIcon />}>
              Upload file
              <VisuallyHiddenInput
                onChange={(e) => {
                  const files = e.target.files;
                  setUploadFile(undefined);
                  if (files !== null && files[0] !== undefined) {
                    setUploadFile(files[0]);
                  }
                }}
                type='file'
              />
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Fragment>
      <CssBaseline />
      <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
        <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {userAvatar}
            <Typography component='h1' variant='h5'>
              내 정보 조회
            </Typography>
            {infoBox}
          </Box>
          <Fragment>
            {isSNS && snsSignUp}
            {buttonGroup}
            {isSNS || snsConnection}
          </Fragment>
        </Paper>
      </Container>
      <DeleteUserDialog open={open === 'deleteDialog'} handleClose={handleClose} deleteUser={deleteUser} />
      <DisconnectSnsDialog
        snsToKorean={snsToKorean}
        open={open === 'disconnectSnsDialog'}
        handleClose={handleClose}
        snsType={selectedSns}
        disconnectSns={disconnectSns}
      />
      <ChangeSnsDialog
        snsToKorean={snsToKorean}
        open={open === 'changeSnsDialog'}
        handleClose={handleClose}
        snsType={selectedSns}
      />
      <Join open={open === 'signUpDialog'} handleClose={handleClose} userNo={user.userNo} />
      <ChangePasswordDialog open={open === 'changePasswordDialog'} handleClose={handleClose} />
      <ChangeEmailDialog open={open === 'changeEmailDialog'} handleClose={handleClose} />
      <ChangePhoneDialog open={open === 'changePhoneDialog'} handleClose={handleClose} />
    </Fragment>
  );
}

const snsImageLink = {
  KAKAO: '/image/loginImage/kakao_login_round.png',
  NAVER: '/image/loginImage/btnG_아이콘사각.png',
  GOOGLE: '',
} as { [key: string]: string };

const initialSnsSet = {
  NAVER: false,
  KAKAO: false,
  GOOGLE: false,
} as { [key: string]: boolean };

const snsToKorean = {
  KAKAO: '카카오',
  NAVER: '네이버',
  GOOGLE: '구글',
} as { [key: string]: string };

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
