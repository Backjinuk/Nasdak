import Button from "@mui/material/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import {useState} from "react";

export default function BankAccount() {
    const [open, setOpen] = useState(false);

    const  handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Button variant='contained' onClick={() => setOpen(true)} sx={{marginRight:1}}>
                계좌등록
            </Button>

            <Dialog open={open} onClose={handleClose} sx={{zIndex: 1000}}>
                <DialogTitle>계좌등록</DialogTitle>
                <DialogContent sx={{width: 400}}>
                </DialogContent>
                <DialogActions>
                    <Stack spacing={1} direction='row' justifyContent='right'>
                        <Button variant='outlined' >
                            닫기
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
}