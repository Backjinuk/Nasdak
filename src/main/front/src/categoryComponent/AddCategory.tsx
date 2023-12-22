import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function AddCategory({changeEvent} : any){
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{setOpen(false)};

    const canAddCategory = (content==='');

    function addCategory(){
        const data = {
            userNo : sessionStorage.getItem('userNo'),
            content : content
        };
        axios.post("/api/category/addCategory", JSON.stringify(data)
            ,{
                headers : {
                    "Content-Type" : "application/json"
                }
            }).then(res=>{
                handleClose();
                changeEvent();
            },error=>{
                alert('failed')
            })
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