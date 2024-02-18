import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import { axiosConnectNewSns, axiosDeleteSnsMap } from 'app/slices/userSlice';
import { useState } from 'react';

export default function ConnectToExistUserDialog(props: any) {
  const dispatch = useAppDispatch();

  const open = props.open;
  const existUsers = props.existUsers;
  const snsKey = props.snsKey;
  const handleClose = () => {
    dispatch(axiosDeleteSnsMap(snsKey));
    props.handleClose();
  };
  const loginNavigate = (data: any) => {
    props.loginNavigate(data.accessToken, data.refreshToken, data.accessTokenExpiresIn, data.refreshTokenExpiresIn);
  };

  const [selectUser, setSelectUser] = useState<number>(0);

  const handleSnsSignUp = async () => {
    const action = await dispatch(axiosConnectNewSns({ key: snsKey, userNo: selectUser }));
    loginNavigate(action.payload);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>이미 가입된 계정이 있습니다.</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>연동할 계정을 선택해주세요</DialogContentText>
        <FormControl>
          <RadioGroup
            onChange={(e) => {
              setSelectUser(Number(e.target.value));
            }}
            value={selectUser}
            name='radio-buttons-group'
          >
            <FormControlLabel value='0' control={<Radio />} label='새로운 계정' />
            {existUsers &&
              existUsers.map((user: any) => (
                <FormControlLabel
                  key={user.userNo}
                  value={user.userNo}
                  control={<Radio />}
                  label={user.userId || user.snsDtoList[0].snsType + '계정'}
                />
              ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button id='change' onClick={handleSnsSignUp}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
