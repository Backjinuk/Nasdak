import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { CategoryType } from "TypeList";
import { useAppDispatch } from "app/hooks";
import { axiosAddCategory } from "app/slices/categoriesSlice";
import { useState } from "react";

export default function AddCategory(){
    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{setOpen(false)};

    const userNo = Number(sessionStorage.getItem('userNo'))
    const canAddCategory = (content==='');

    async function addCategory(){
        const data:CategoryType = {
            categoryNo : 0,
            userNo,
            content,
            delYn : '',
        };
        await dispatch(axiosAddCategory(data))
        handleClose();
    }

    return (<>
        <Button variant="outlined" onClick={handleClickOpen}>
          추가
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>카테고리 추가</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="content"
              label="카테고리명"
              fullWidth
              value={content}
              variant="outlined"
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setContent(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button onClick={addCategory} disabled={canAddCategory}>등록</Button>
          </DialogActions>
        </Dialog>
    </>)
}