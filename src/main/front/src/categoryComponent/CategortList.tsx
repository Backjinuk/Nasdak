import {useState} from "react";
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import AddCategory from "./AddCategory";
import Category from "./Category";
import IntegrateCategory from "./IntegrateCategory";
import { useAppSelector } from "app/hooks";
import { selectAllCategories, selectCategoryIds } from "app/slices/categoriesSlice";

export default function CategoryList() {
    const categoryList = useAppSelector(selectAllCategories)
    const categoryIds = useAppSelector(selectCategoryIds)

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{
        setOpen(false);
        setTimeout(()=>{
            setIsEdit(false);
        },500);
    };
    const handleEditButton = ()=>{setIsEdit(!isEdit)};

    const renderedCategory = categoryIds.map(categoryId => (
        <Category key={categoryId} categoryId={categoryId} isEdit={isEdit} />
    ))

    return (<div >
        <Button variant="contained" onClick={handleOpen}>카테고리 관리
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{zIndex:1000}} >
            <DialogTitle>
                카테고리
            </DialogTitle>
            <DialogContent sx={{width:400}}>
                <Stack sx={{width:'-webkit-fill-available'}} spacing={1}>
                    {renderedCategory}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack spacing={1} direction="row" justifyContent="right">
                    {isEdit? '' : <AddCategory />}
                    {isEdit? <IntegrateCategory setIsEdit={setIsEdit} categoryList={categoryList}/> : ''}
                    <Button variant="outlined" onClick={handleEditButton}>{isEdit?'완료':'편집'}</Button>
                    <Button variant="outlined" onClick={handleClose}>닫기</Button>
                </Stack>
            </DialogActions>
        </Dialog>
        </div>)
}