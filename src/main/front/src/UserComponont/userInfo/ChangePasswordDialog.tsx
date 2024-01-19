import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { axiosChangePassword, selectUser } from 'app/slices/userSlice';
import { useState } from 'react';

export default function ChangePasswordDialog(props: any) {
  const open = props.open;
  const handleClose = () => {
    setPassword('');
    setLastPassword('');
    setPasswordCheck('');
    props.handleClose();
  };
  const dispatch = useAppDispatch();
  const userNo = useAppSelector(selectUser).userNo;
  const existPassword = useAppSelector(selectUser).password;
  const [lastPassword, setLastPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const changePassword = () => {
    if (password !== passwordCheck || lastPassword !== existPassword) return;
    dispatch(axiosChangePassword({ userNo, password }));
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>비밀번호 입력</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={2}>
          <TextField
            fullWidth
            id='lastPassword'
            label='기존 비밀번호'
            name='lastPassword'
            type='password'
            value={lastPassword}
            onChange={(e) => {
              setLastPassword(e.target.value);
            }}
          />
          <TextField
            fullWidth
            id='password'
            label='비밀번호'
            name='password'
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            fullWidth
            id='passwordCheck'
            label={password === passwordCheck ? '비밀번호 확인' : '비밀번호가 일치하지 않습니다'}
            name='passwordCheck'
            type='password'
            value={passwordCheck}
            onChange={(e) => {
              setPasswordCheck(e.target.value);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button disabled={password !== passwordCheck || lastPassword !== existPassword} onClick={changePassword}>
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}
