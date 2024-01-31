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
  axiosIsDuplicatedPhone,
  axiosSendPhone,
  axiosUpdatePhone,
  axiosVerifyPhone,
  selectUser,
} from 'app/slices/userSlice';
import { useTimer } from 'customFunction/useTimer';

export default function ChangePhoneDialog(props: any) {
  const dispatch = useAppDispatch();
  const userNo = useAppSelector(selectUser).userNo;
  const { restart, stop, viewTime } = useTimer(5, 'min');

  const open = props.open;
  const handleClose = () => {
    props.handleClose();
    setPhone('');
    setCode('');
    setStatus('');
    stop();
  };
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');

  const sendPhone = async () => {
    const action = await dispatch(axiosIsDuplicatedPhone(phone));
    if (action.payload) {
      alert('사용중인 휴대폰입니다.');
    } else {
      restart();
      dispatch(axiosSendPhone(phone));
      setStatus('sended');
    }
  };

  const verifyPhone = async () => {
    const action = await dispatch(axiosVerifyPhone({ phone, code }));
    if (action.payload) {
      alert('인증에 성공하였습니다.');
      setStatus('succeeded');
      stop();
    } else {
      alert('인증에 실패하였습니다.');
    }
  };

  const handleChange = async () => {
    if (status !== 'succeeded') return;
    await dispatch(axiosUpdatePhone({ userNo, phone }));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>휴대폰 변경</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            id='phone'
            label='휴대폰'
            name='phone'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setStatus('');
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Button
                    onClick={() => {
                      sendPhone();
                    }}
                    variant='contained'
                    endIcon={<SendIcon />}
                  >
                    문자 발송
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
                        verifyPhone();
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
