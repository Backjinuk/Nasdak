import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import { connectSns } from 'app/slices/userSlice';
import axios from 'customFunction/customAxios';

export default function ChangeSnsDialog(props: any) {
  const dispatch = useAppDispatch();

  const snsToKorean = props.snsToKorean;
  const open = props.open;
  const handleClose = () => {
    props.handleClose();
  };
  const snsType = String(props.snsType);

  async function changeSnsUser() {
    const data = {
      userNo: sessionStorage.getItem('userNo'),
      snsNo: sessionStorage.getItem('dbSnsNo'),
    };
    await axios.post('/api/sns/changeConnection', JSON.stringify(data));
    dispatch(connectSns(snsType));
    sessionStorage.removeItem('dbSnsNo');
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'이미 연동된 계정이 있습니다.'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>해당 계정으로 연동 정보를 변경하시겠습니까?</DialogContentText>
        <DialogContentText id='alert-dialog-description'>
          {snsToKorean[snsType]} 로그인을 통해 원래 계정으로 접속하지 못하게 됩니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button id='change' onClick={changeSnsUser} autoFocus>
          변경
        </Button>
      </DialogActions>
    </Dialog>
  );
}
