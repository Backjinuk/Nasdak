import {useState} from "react";
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import AddCategory from "./AddCategory";
import Category from "./Category";
import IntegrateCategory from "./IntegrateCategory";

export default function CategoryList({categoryList, changeEvent}: any) {
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

    const css: any = {
        height: "150px", display: "flex", alignItems: "center", justifyContent: "right", marginRight: "30%"
    }

    return (<div style={css}>
        <Button variant="outlined" onClick={handleOpen}>카테고리
        </Button>
        <Dialog open={open} onClose={handleClose} sx={{zIndex:1000}} >
            <DialogTitle>
                카테고리
            </DialogTitle>
            <DialogContent sx={{width:400}}>
                <Stack sx={{width:'-webkit-fill-available'}} spacing={1}>
                    {categoryList.map((item:any)=>(
                        <Category key={item.categoryNo} item={item} isEdit={isEdit} changeEvent={changeEvent}/>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack spacing={1} direction="row" justifyContent="right">
                    {isEdit? '' : <AddCategory changeEvent={changeEvent}/>}
                    {isEdit? <IntegrateCategory setIsEdit={setIsEdit} changeEvent={changeEvent} categoryList={categoryList}/> : ''}
                    <Button variant="outlined" onClick={handleEditButton}>{isEdit?'완료':'편집'}</Button>
                    <Button variant="outlined" onClick={handleClose}>닫기</Button>
                </Stack>
            </DialogActions>
        </Dialog>
        </div>)
}