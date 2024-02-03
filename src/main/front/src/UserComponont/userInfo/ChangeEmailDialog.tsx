import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  axiosIsDuplicatedEmail,
  axiosSendEmail,
  axiosUpdateEmail,
  axiosVerifyEmail,
  selectUser,
} from 'app/slices/userSlice';
import { useTimer } from 'customFunction/useTimer';

export default function ChangeEmailDialog(props: any) {
  const dispatch = useAppDispatch();
  const userNo = useAppSelector(selectUser).userNo;
  const timer = useTimer(5, 'min');
  const viewTime = timer.viewTime;

  const open = props.open;
  const handleClose = () => {
    props.handleClose();
    setEmail('');
    setCode('');
    setStatus('');
    timer.stop();
  };
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    const action = await dispatch(axiosIsDuplicatedEmail(email));
    if (action.payload) {
      alert('사용중인 이메일입니다.');
    } else {
      timer.restart();
      dispatch(axiosSendEmail(email));
      setStatus('sended');
    }
  };

  const verifyEmail = async () => {
    const action = await dispatch(axiosVerifyEmail({ email, code }));
    if (action.payload) {
      alert('인증에 성공하였습니다.');
      setStatus('succeeded');
      timer.stop();
    } else {
      alert('인증에 실패하였습니다.');
    }
  };

  const handleChange = async () => {
    if (status !== 'succeeded') return;
    await dispatch(axiosUpdateEmail({ userNo, email }));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>이메일 변경</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id='email'
            label='이메일'
            name='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus('');
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Button
                    onClick={() => {
                      sendEmail();
                    }}
                    variant='contained'
                    endIcon={<SendIcon />}
                  >
                    메일 전송
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {status === 'sended' && (
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
                    <Button
                      onClick={() => {
                        verifyEmail();
                      }}
                      variant='contained'
                    >
                      확인
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button id='change' disabled={status !== 'succeeded'} onClick={handleChange}>
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}
