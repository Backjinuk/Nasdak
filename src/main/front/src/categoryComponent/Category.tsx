import { Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Category(props : any){
    const item = props.item;
    const isEdit = props.isEdit && item.delYn==='Y';
    const changeEvent = ()=>{props.changeEvent()};

    return (
        <ButtonGroup sx={{width:'-webkit-fill-available'}} variant="outlined" aria-label="outlined button group">
            <Button sx={{width:(isEdit?'60%':'100%'), textTransform:'none'}} >{item.content}</Button>
            {isEdit?<UpdateCategory changeEvent={changeEvent} item={item}/>:''}
            {isEdit?<DeleteCategory changeEvent={changeEvent} item={item}/>:''}
        </ButtonGroup>
    );
}

function UpdateCategory(props : any){
    const changeEvent = ()=>{props.changeEvent()};
    const item = props.item;
    const [open, setOpen] = useState(false);
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{setOpen(false)};
    const [content, setContent] = useState(item.content);

    const canUpdateCategory = (content==='');

    function updateCategory(){
        const data = {
            categoryNo : item.categoryNo,
            content : content
        };
        axios.post("/api/category/updateCategory", JSON.stringify(data)
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
        <Button sx={{width:'20%'}} onClick={handleClickOpen}>
          수정
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>카테고리 수정</DialogTitle>
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
            <Button onClick={updateCategory} disabled={canUpdateCategory}>수정</Button>
          </DialogActions>
        </Dialog>
    </>)
}

function DeleteCategory(props : any){
    const changeEvent = ()=>{props.changeEvent()};
    const item = props.item;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{setOpen(false)};

    const loadingDialog = (<CircularProgress size={20} />);

    function deleteCategory(){
        const data = {
            categoryNo : item.categoryNo,
            userNo : sessionStorage.getItem('userNo')
        };
        setLoading(true)
        axios.post("/api/category/deleteCategory", JSON.stringify(data),
        {
            headers:{"Content-Type":'application/json'}
        }).then(res=>{
            setLoading(false);
            handleClose();
            changeEvent();
        });
    }

    return (
        <>
        <Button sx={{width:'20%'}} onClick={handleClickOpen}>
          삭제
        </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    정말 삭제하시겠습니까?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        해당 카테고리의 가계부는 '기타'카테고리로 변경됩니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={deleteCategory}>삭제{loading?loadingDialog:''}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}