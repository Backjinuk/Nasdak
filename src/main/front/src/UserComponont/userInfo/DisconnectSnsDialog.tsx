import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DisconnectSnsDialog(props: any) {
  const snsToKorean = props.snsToKorean;
  const open = props.open;
  const handleClose = () => {
    props.handleClose();
  };
  const snsType = String(props.snsType);
  const disconnectSns = (snsType: string) => {
    props.disconnectSns(snsType);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'계정 연동 해제'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {snsToKorean[snsType] + ' 계정의 연동을 해제하시겠습니까?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          onClick={() => {
            disconnectSns(snsType);
          }}
        >
          연동 해제
        </Button>
      </DialogActions>
    </Dialog>
  );
}
