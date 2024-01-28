import axios from "axios";
import Swal from "sweetalert2";
import {useEffect, useRef, useState} from "react";
import {CategoryType, location} from "../TypeList";
import "./Ledger.css"
import Ledger from "./Ledger";
import KakaoMap from "../MapComponont/LedgerMapComponont/KakaoMap";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {Box, Input} from "@mui/material";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SendIcon from '@mui/icons-material/Send';

export default function CreateLeger({ChangeEvent,categoryList} : any){

    const [open, setOpen] = React.useState(false);
    const [location, setLocation] = useState<location>({x : 0, y : 0, address : ""});

    const handleOpen = (check : any) =>{
        setOpen(true);
    }
    const handleClose = (check : any) =>{
        setOpen(false);
    }

    const css : any ={
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        marginRight: "3%"
    }

    const addLedger = () => {
        let frm = $("form[name=addLedger]").serializeArray();
        let LedgerDto: any = {}; // JSON 객체로 사용할 빈 객체 생성

        const userDto = {
            userNo: sessionStorage.getItem("userNo"),
            userId: sessionStorage.getItem("userId")
        }

        for (let field of frm) {
            LedgerDto[field.name] = field.value;
            if (field.name === 'category_no') {
                LedgerDto["categoryDto"] = {
                    categoryNo: field.value
                };
            }
        }
        LedgerDto["userDto"] = userDto;
        LedgerDto["location"] = location;

        axios.post("/api/ledger/ledgerSave", JSON.stringify({LedgerDto}), {
            headers: {
                "Content-Type": "application/json; charset=UTF-8;",
                //"Authorization": Cookies.get("jwtCookie")
            }
        }).then((res) => {
            if (res.data != null) {

                //파일 업로드
                const formData = formDataArray();

                if(formData && formData.getAll('file').length > 0){
                    fileUpload(formData, res.data.fileOwnerNo);
                }

                Swal.fire({
                    icon: 'success',
                    title: '작성되었습니다.',
                    timer: 400
                }).then(r => {

                    ChangeEvent();
                    setOpen(false);

                });
            }

        }).catch(error => {
            console.error(error); // 오류 발생 시 콘솔에 표시

            Swal.fire({
                icon: 'error',
                title: '에러가 발생하였습니다.',
                timer: 400
            }).then(r => {

                // @ts-ignore
                $("#addLedger").modal("hide");
            });
        });
    }

    function fileUpload(formData: FormData, fileOwnerNo : string){
        formData.append('fileOwnerNo', fileOwnerNo);

        axios.post("/api/ledger/uploadFile", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // "Authorization": Cookies.get("jwtCookie")
            }
        }).then(response => {
        }).catch(error => {
            console.error(error); // 오류 발생 시 콘솔에 표시
        });
    }


    const LocationAppend = (x : number ,y : number, address : any) => {
        setLocation(prevLocation => ({
            ...prevLocation,
            x: x,
            y: y,
            address: address
        }));

        console.log(location)
    }


    function formDataArray(){
        const file = document.getElementById("file");

        const formData = new FormData();

        // @ts-ignore
        const fileLength = file.files.length;

        for (let i = 0; i < fileLength; i++) {
            // @ts-ignore
            formData.append('file', file.files[i]);
        }

        return formData;
    }




    return(
        <>
            <Button  sx={{ color: '#fff' }} onClick={handleOpen} >
                글쓰기
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box className={"modalBox"}>

                    <Typography id="parent-modal-title" variant="h6" component="h2" sx={{marginBottom : '20px'}}>
                        글쓰기
                    </Typography>

                    <form name={"addLedger"}>
                        <div id={"parent-modal-description"}>
                            <div className={"mb30"} style={{marginBottom: "30px"}}>
                                <TextField
                                    fullWidth={true}
                                    id="category_no"
                                    name={"category_no"}
                                    select
                                    label="카테고리"
                                    defaultValue="0"  // 초기에 선택되어야 하는 값으로 빈 문자열을 할당
                                >
                                    <MenuItem value={0}>선택</MenuItem>
                                    {categoryList && categoryList.length > 0 && (
                                        categoryList.map((category: CategoryType, index: number) => (
                                            <MenuItem key={index} value={category.categoryNo}>
                                                {category.content}
                                            </MenuItem>
                                        ))
                                    )}

                                </TextField>
                            </div>

                            <div className={"mb30"} style={{marginBottom: "30px"}}>
                                <TextField fullWidth={true} id="ledgerType" name={"ledgerType"} select label="입/출금"
                                           defaultValue="DEPOSIT">
                                    <MenuItem key={"DEPOSIT"} value={"DEPOSIT"}>출금</MenuItem>
                                    <MenuItem key={"SAVE"} value={"SAVE"}>입금</MenuItem>
                                </TextField>
                            </div>

                            <div className={"mb30"} style={{marginBottom: "30px"}}>
                                <TextField className={"md30"} fullWidth={true} id="price" label="가격을 입력해 주세요"
                                           variant="outlined" name={"price"}/>
                            </div>
                            

                            <div className={"mb30"} style={{marginBottom: "30px"}}>
                                <KakaoMap  LocationAppend={LocationAppend} location={location}/>
                            </div>

                            <div className={"mb30"} style={{marginBottom : "30px"}}>
                                <TextField className={"md30"} fullWidth={true} name="comment"  id="comment" label="내용을 입력해 주세요" variant="outlined"/>
                            </div>

                            <div className="input-group mb-3">
                                <input type="file" multiple className="form-control uploadFile" id="file"/>
                                <label className="input-group-text" htmlFor="file">Upload</label>
                            </div>

                        </div>
                        <div className={"modalSendBox"}>
                            <Button variant="contained" endIcon={<SendIcon />} onClick={() => addLedger()} sx={{marginRight : "10px"}}>
                                등록
                            </Button>

                            <Button variant="outlined" color="error" onClick={handleClose}>
                                취소
                            </Button>
                        </div>

                    </form>
                </Box>
            </Modal>
         </>
    )
}