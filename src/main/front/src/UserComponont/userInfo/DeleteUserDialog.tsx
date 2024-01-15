import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DeleteUserDialog(props: any) {
  const open = props.open;
  const handleClose = () => {
    props.handleClose();
  };
  const deleteUser = () => {
    props.deleteUser();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'정말 회원탈퇴하시겠습니까?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>계정을 복구할 수 없습니다.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button id='delete' onClick={deleteUser} autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
