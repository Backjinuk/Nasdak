import { Button, ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { CategoryType } from "TypeList";
import { useAppDispatch } from "app/hooks";
import { axiosDeleteCategory, axiosUpdateCategory, selectCategoryById } from "app/slices/categoriesSlice";
import { RootState } from "app/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Category({categoryId, isEdit} : {categoryId : number, isEdit : boolean}){
    const category = useSelector((state:RootState)=>selectCategoryById(state, categoryId));
    const canEdit = isEdit && category.delYn==='Y';

    return (
        <ButtonGroup sx={{width:'-webkit-fill-available'}} variant="outlined" aria-label="outlined button group">
            <Button sx={{width:(canEdit?'60%':'100%'), textTransform:'none'}} >{category.content}</Button>
            {canEdit?<UpdateCategory category={category}/>:''}
            {canEdit?<DeleteCategory category={category}/>:''}
        </ButtonGroup>
    );
}

function UpdateCategory({category}:{category:CategoryType}){
    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false);
    const handleClickOpen = ()=>{setContent(category.content);setOpen(true)};
    const handleClose = ()=>{setOpen(false)};
    const [content, setContent] = useState(category.content);

    const canUpdateCategory = (content==='');

    async function updateCategory(){
        const data:CategoryType = {...category, content}
        await dispatch(axiosUpdateCategory(data))
        handleClose();
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

function DeleteCategory({category}:{category:CategoryType}){
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{setOpen(false)};

    const loadingDialog = (<CircularProgress size={20} />);

    async function deleteCategory(){
        setLoading(true)
        await dispatch(axiosDeleteCategory(category))
        setLoading(false);
        handleClose();
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