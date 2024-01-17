import { ChangeEvent, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ButtonGroup, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Stack, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { formHeader, jsonHeader } from 'headers';
import { useAppDispatch } from 'app/hooks';
import { axiosUpdateSnsUser } from 'app/slices/userSlice';
import { User } from 'classes';

export default function Join(props: any) {
  const dispatch = useAppDispatch();

  const open = props.open;
  const userNo = props.userNo;
  const handleClose = () => {
    setSid('');
    setSpwd('');
    setEmail('');
    setPhone('');
    setIdSearch('');
    setUploadFile(undefined);
    setImgBase64([]);
    setAddMemberBtn(false);
    setCode('');
    setPage(1);
    setRadio('email');
    props.handleClose();
  };
  const [sid, setSid] = useState('');
  const [spwd, setSpwd] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [radio, setRadio] = useState('email');
  const [page, setPage] = useState(1);
  const [code, setCode] = useState('');
  const [uploadFile, setUploadFile] = useState<any>();
  const [imgBase64, setImgBase64] = useState<string[]>([]);
  const [addMemberbtn, setAddMemberBtn] = useState(false);
  const [limit, setLimit] = useState(300 * 1000);
  const [time, setTime] = useState(0);
  const timer = useRef<any>(null);
  const isSNS = userNo !== undefined;
  const leftTime = Math.floor((limit - time) / 1000);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function idCheck(e: ChangeEvent<HTMLInputElement>) {
    axios.post('/api/user/canUseUserId', JSON.stringify({ userId: e.target.value }), jsonHeader).then((res) => {
      if (res.data) {
        setIdSearch('사용 가능한 아이디 입니다');
        setAddMemberBtn(false);
      } else {
        setIdSearch('이미 사용중인 아이디 입니다');
        setAddMemberBtn(true);
      }
    });
    setSid(e.target.value);
  }

  async function requestValidationUser() {
    let data = {
      userId: sid,
      password: spwd,
    } as { [key: string]: string };
    if (radio === 'email') {
      data.email = email;
    } else {
      data.phone = phone;
    }
    console.log(data);

    const missingField = Object.keys(data).find((field) => !data[field]);

    if (missingField) {
      swalert(
        missingField === 'userId'
          ? '아이디'
          : missingField === 'password'
          ? '비밀번호'
          : missingField === 'email'
          ? '이메일'
          : '전화번호'
      );
      return false;
    }
    try {
      await axios.post('/api/user/validateSignUpUser', JSON.stringify(data), jsonHeader);

      sendCode();
      setPage(2);
      setAddMemberBtn(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const res = error.response?.data;
        if (res === 'id') {
          alert('사용중인 아이디입니다.');
        } else if (res === 'exist') {
          let auth = '이메일';
          if (radio === 'phone') auth = '휴대폰';
          alert(`사용중인 ${auth}입니다.`);
        }
      }
    }
  }

  async function signUp() {
    if (!addMemberbtn) return;
    let data = {
      userId: sid,
      password: spwd,
    } as { [key: string]: string };
    if (radio === 'email') {
      data.email = email;
    } else {
      data.phone = phone;
    }
    const res = await axios.post(`/api/user/signUp`, JSON.stringify(data), jsonHeader);
    profileUpload(res.data.userNo);
    Swal.fire({
      icon: 'success',
      title: '회원가입 되었습니다..',
      timer: 2000,
    }).then(() => {
      handleClose();
    });
  }

  async function snsSignUp() {
    const data = {
      userNo: userNo,
      userId: sid,
      password: spwd,
    } as { [key: string]: string };

    const missingField = Object.keys(data).find((field) => !data[field]);

    if (missingField) {
      swalert(missingField === 'userId' ? '아이디' : '비밀번호');
      return false;
    }

    const signUpUser = User.getByData(data);

    await dispatch(axiosUpdateSnsUser(signUpUser));

    Swal.fire({
      icon: 'success',
      title: '회원가입 되었습니다..',
      timer: 2000,
    }).then(() => {
      handleClose();
    });
  }

  function profileUpload(userNo: any) {
    if (uploadFile !== undefined) {
      let fd = new FormData();
      fd.append('mf', uploadFile);
      fd.append('userNo', userNo);

      axios.post('/api/user/uploadProfile', fd, formHeader);
    }
  }

  function swalert(str: string) {
    Swal.fire({
      icon: 'error',
      title: str + '입력하여 주세요.',
    });
  }
  const pageOne = (
    <>
      <Box>
        <FormGroup>
          <div className='form-floating mb-3'>
            <input
              type='text'
              className='form-control setId'
              id='floatingId'
              value={sid}
              onChange={(e) => idCheck(e)}
              placeholder='name@example.com'
            />
            {idSearch === '' ? (
              <label htmlFor='floatingId'>아이디</label>
            ) : (
              <label style={{ color: 'red' }}>{idSearch}</label>
            )}
          </div>

          <div className='form-floating mb-3'>
            <input
              type='password'
              className='form-control'
              id='floatingPassword'
              value={spwd}
              onChange={(e) => {
                setSpwd(e.target.value);
              }}
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>비밀번호</label>
          </div>
          {isSNS || (
            <>
              <FormControl>
                <RadioGroup
                  defaultValue='email'
                  name='radio-buttons-group'
                  row={true}
                  value={radio}
                  onChange={(e) => {
                    setRadio(e.target.value);
                  }}
                >
                  <FormControlLabel value='email' control={<Radio />} label='이메일 인증' />
                  <FormControlLabel value='phone' control={<Radio />} label='휴대폰 인증' />
                </RadioGroup>
              </FormControl>
              {radio === 'email' ? (
                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    className='form-control'
                    id='floatingEmail'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder='Email'
                  />
                  {true ? (
                    <label htmlFor='floatingEmail'>Email</label>
                  ) : (
                    <label htmlFor='floatingEmail' style={{ color: 'red' }}>
                      사용중인 이메일입니다.
                    </label>
                  )}
                </div>
              ) : (
                <div className='form-floating mb-3'>
                  <input
                    type='number'
                    className='form-control'
                    id='floatingPhone'
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    placeholder='Phone'
                  />
                  {true ? (
                    <label htmlFor='floatingPhone'>Phone</label>
                  ) : (
                    <label htmlFor='floatingPhone' style={{ color: 'red' }}>
                      사용중인 휴대폰입니다.
                    </label>
                  )}
                </div>
              )}
              <Button component='label' sx={{ width: '100%' }} variant='contained' startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput
                  onChange={(e) => {
                    const files = e.target.files;
                    setImgBase64([]);
                    setUploadFile(undefined);
                    if (files !== null && files[0] !== undefined) {
                      setUploadFile(files[0]);
                      let reader = new FileReader();
                      reader.readAsDataURL(files[0]);
                      reader.onloadend = () => {
                        const base64 = reader.result;
                        if (base64) {
                          var base64Sub = base64.toString();

                          setImgBase64((imgBase64) => [...imgBase64, base64Sub]);
                        }
                      };
                    }
                  }}
                  type='file'
                />
              </Button>
              {imgBase64.map((item, idx) => (
                <img src={item} alt={item} key={idx} style={{ width: '100%' }} />
              ))}
            </>
          )}
        </FormGroup>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='button' className='btn btn-secondary' onClick={handleClose}>
          {' '}
          취소
        </Button>

        <Button
          type='button'
          onClick={isSNS ? () => snsSignUp() : () => requestValidationUser()}
          className={!addMemberbtn ? 'btn btn-info' : 'btn btn-danger disabled'}
        >
          {isSNS ? '회원가입' : '다음'}
        </Button>
      </Box>
    </>
  );
  const sendCode = () => {
    clearInterval(timer.current);
    setLimit(Date.now() + 5 * 60 * 1000);
    timer.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    if (radio === 'email') {
      sendEmail();
    } else {
      sendPhone();
    }
  };

  const verifyCode = async () => {
    let res;
    if (radio === 'email') {
      res = await verifyEmail();
    } else {
      res = await verifyPhone();
    }
    if (res.data) {
      alert('인증에 성공하였습니다.');
      clearTimeout(timer.current);
      setTime(0);
      setAddMemberBtn(true);
    } else {
      alert('인증에 실패하였습니다.');
    }
  };

  const sendEmail = () => {
    axios.get(`/api/user/sendEmail/${email}`, jsonHeader);
  };

  const verifyEmail = async () => {
    return await axios.post('/api/user/verifyEmail', JSON.stringify({ email, code }), jsonHeader);
  };

  const sendPhone = () => {
    axios.get(`/api/user/sendPhone/${phone}`, jsonHeader);
  };

  const verifyPhone = async () => {
    return await axios.post('/api/user/verifyPhone', JSON.stringify({ phone, code }), jsonHeader);
  };

  const viewTime = '0' + Math.floor(leftTime / 60) + ':' + ('0' + (leftTime % 60)).slice(-2);

  const pageTwo = (
    <>
      <Box>
        <FormGroup>
          <div className='form-floating mb-3'>
            <input
              type='text'
              className='form-control'
              id='floatingCode'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder=''
            />
            <label htmlFor='floatingCode'>인증코드 {time === 0 ? '' : leftTime < 0 ? '시간 초과' : viewTime}</label>
          </div>
          <ButtonGroup variant='contained' aria-label='outlined primary button group'>
            <Button sx={{ width: '50%' }} onClick={sendCode}>
              인증메일 재발급
            </Button>
            <Button sx={{ width: '50%' }} onClick={verifyCode}>
              인증 확인
            </Button>
          </ButtonGroup>
        </FormGroup>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='button' className='btn btn-secondary' onClick={handleClose}>
          취소
        </Button>
        <Button
          type='button'
          onClick={() => {
            signUp();
          }}
          className={addMemberbtn ? 'btn btn-info' : 'btn btn-danger disabled'}
        >
          회원가입
        </Button>
      </Box>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ zIndex: 1000 }}
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h1'>
          회원가입
        </Typography>
        <Stack spacing={2}>{page === 1 ? pageOne : pageTwo}</Stack>
      </Box>
    </Modal>
  );
}

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
