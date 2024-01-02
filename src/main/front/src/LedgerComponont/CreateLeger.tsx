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


function VisuallyHiddenInput(props: { type: string }) {
    return null;
}

export default function CreateLeger({ChangeEvent, categoryList} : any){

    const [location, setLocation] = useState<location>({x : 0, y : 0, address : ""});
    const [lodingEvent, setLodingEvent] = useState(true);

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
            console.log("filedId : " + field.name + " file.value : " + field.value)
            if (field.name === 'category_no') {
                LedgerDto["categoryDto"] = {
                    categoryNo: field.value
                };
            }
        }
        LedgerDto["userDto"] = userDto;
        LedgerDto["location"] = location;

        console.log("ledgerDto : " + JSON.stringify({LedgerDto}))


        axios.post("/api/ledger/ledgerSave", JSON.stringify({LedgerDto}), {
            headers: {
                "Content-Type": "application/json; charset=UTF-8;",
                //"Authorization": Cookies.get("jwtCookie")
            }
        }).then((res) => {
            if (res.data != null) {

                //파일 업로드
                const formData = formDataArray();
                fileUpload(formData, res.data.fileOwnerNo);


                Swal.fire({
                    icon: 'success',
                    title: '작성되었습니다.',
                    timer: 400
                }).then(r => {

                    ChangeEvent();
                    // @ts-ignore
                    $("#addLedger").modal("hide");

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


    const LocationAppend = (x : number ,y : number, address : any) => {

        console.log("x :" + x + "y : " + y)
        console.log("assress : "  + address     )

        setLocation(prevLocation => ({
            ...prevLocation,
            x: x,
            y: y,
            address: address
        }));

        console.log(location);

        // @ts-ignore
        $("#KakaoMap").modal("hide")
    }


    return(
        <>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>

                <Button  sx={{ color: '#fff' }}
                         data-bs-toggle="modal"
                         data-bs-target="#addLedger">
                    글쓰기
                </Button>
            </Box>

            <form></form>
            <div className="modal fade " id="addLedger" data-bs-keyboard="false"
                 aria-labelledby="staticBackdropLabel" aria-hidden="true" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">글쓰기</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <form name={"addLedger"}>
                            <div className="modal-body">

                                <div className={"mb30"} style={{marginBottom: "30px"}}>
                                    <TextField
                                        fullWidth={true}
                                        id="category_no"
                                        name={"category_no"}
                                        select
                                        label="카테고리"
                                        defaultValue="1"  // 초기에 선택되어야 하는 값으로 빈 문자열을 할당
                                    >
                                        {categoryList.map((category: CategoryType, index: number) => (
                                            <MenuItem key={index} value={category.categoryNo}>
                                                {category.content}
                                            </MenuItem>
                                        ))}
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
                                    <TextField className={"md30"} fullWidth={true} id="location" label="지역을 입력해 주세요"
                                               variant="outlined" value={location?.address}
                                               onMouseDown={() => {
                                                   setLodingEvent(lodingEvent ? false : true);
                                                   // @ts-ignore
                                                   $("#KakaoMap").modal("show");
                                               }}

                                               onFocus={() =>{
                                                   setLodingEvent(lodingEvent ? false : true);
                                                   // @ts-ignore
                                                   $("#KakaoMap").modal("show");
                                               }}
                                    />
                                </div>
                                <div className={"mb30"} style={{marginBottom : "30px"}}>
                                    <TextField className={"md30"} fullWidth={true} name="comment"  id="comment" label="내용을 입력해 주세요" variant="outlined"/>
                                </div>

{/*
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload file
                                    <VisuallyHiddenInput type="file" />
                                </Button>*/}


                                <div className="input-group mb-3">
                                    <input type="file" multiple className="form-control uploadFile" id="file"/>
                                    <label className="input-group-text" htmlFor="file">Upload</label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => addLedger()}>롹인</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> 취소
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
                <KakaoMap LocationAppend={LocationAppend} lodingEvent={lodingEvent}/>
            </div>

        </>
    )
}