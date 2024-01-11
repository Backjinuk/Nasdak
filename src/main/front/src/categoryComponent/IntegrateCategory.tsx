import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Radio } from "@mui/material";
import { CategoryType } from "TypeList";
import { useAppDispatch } from "app/hooks";
import { axiosIntegrateCategory } from "app/slices/categoriesSlice";
import { useState } from "react";

export default function IntegrateCategory({categoryList, setIsEdit} : {categoryList : CategoryType[], setIsEdit:Function}){
    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const handleClickOpen = ()=>{setOpen(true)};
    const handleClose = ()=>{
        setOpen(false)
        setBefore([])
    };
    const [before, setBefore] = useState<number[]>([]);
    const [after, setAfter] = useState<number>(0);

    function handleBefore(e:any){
        const noString :string = e.target.name;
        const no = Number(noString);
        if(e.target.checked){
            const newBefore = [...before, no];
            setBefore(newBefore);
        }else{
            const newBefore = before.filter(n=>n!==no);
            setBefore(newBefore);
        }
    }

    function handleAfter(e:any){
        const noString :string = e.target.name;
        const no = Number(noString);
        if(e.target.checked){
            setAfter(no);
        }else{
            setAfter(0)
        }
    }

    async function integrateCategory(){
        const data = {before, after};
        await dispatch(axiosIntegrateCategory(data))
        setIsEdit(false);
    }

    const stepOne = (<>
            <DialogTitle id="alert-dialog-title">
                    통합할 카테고리를 선택해주세요.
                </DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {categoryList.filter((item:any)=>item.delYn==='Y').map((item:any)=>(
                            <FormControlLabel key={'one'+item.categoryNo} control={<Checkbox checked={before.includes(item.categoryNo)} onChange={e=>{handleBefore(e)}} name={String(item.categoryNo)} />} label={item.content} />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={()=>{setStep(2)}} disabled={before.length===0}>다음</Button>
                </DialogActions>
            </>);

    const stepTwo = (<>
            <DialogTitle id="alert-dialog-title">
                어느 카테고리로 통합할까요?
            </DialogTitle>
            <DialogContent>
                <FormGroup>
                    {categoryList.filter((item:any)=>!before.includes(item.categoryNo)).map((item:any)=>(
                        <FormControlLabel key={'two'+item.categoryNo} control={<Radio checked={item.categoryNo===after} onChange={e=>{handleAfter(e)}} name={String(item.categoryNo)} />} label={item.content} />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{setStep(1); setAfter(0);}}>뒤로</Button>
                <Button onClick={integrateCategory} disabled={after===0}>통합</Button>
            </DialogActions>
    </>);

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
            통합
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {step===1?stepOne:stepTwo}
            </Dialog>
        </>
    );
}