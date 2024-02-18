import Modal from '@mui/material/Modal';
import {LedgerType} from "../TypeList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./Ledger.css";
import Button from "@mui/material/Button";
import * as React from "react";

export default function LedgerDetailModal( {isOpen2, open2, ledgerList, ledgerDetail} : {isOpen2 : any, open2 : any, ledgerList : LedgerType[], ledgerDetail : any }) {

    const ledgerDetailShow = (key : number) => {
        ledgerDetail(key);
    }

    return (
        <div>
            <Modal
                open={open2}
                onClose={() => isOpen2(false)}
                aria-labelledby='parent-modal-title'
                aria-describedby='parent-modal-description'
            >

                <Box className={'modalBox'}>
                    <Typography id='parent-modal-title' variant='h6' component='h2' sx={{marginBottom: '20px'}}>
                        가계부 리스트 보기
                    </Typography>

                    <div className={'ledgerBoxBody'}>
                        {ledgerList.map((ledger, index) => (
                            <div className={"ledgerItem"}
                                 key={index}
                                 onClick={() => ledgerDetailShow(ledger.fileOwnerNo)}>
                                <div> 날짜 : {new Date(ledger.useDate).toLocaleDateString()} </div>
                                <div> {ledger.ledgerType === "SAVE" ? "입금" : "출금"} : {ledger.price} </div>
                            </div>
                        ))}
                    </div>
                    <div className='modal-footer'>
                        <Button variant='contained' color='secondary' onClick={() => isOpen2(false)}>
                            닫기
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )

}