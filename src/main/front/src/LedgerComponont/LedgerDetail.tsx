import {CategoryType, FilesType, LedgerType, location} from "../TypeList";
import axios from "axios";
import {useEffect, useState} from "react";
import Ledger from "./Ledger";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import {red} from "@mui/material/colors";
import KakaoMap2 from "MapComponont/LedgerMapComponont/KakaoMap2";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import KakaoMap from "../MapComponont/LedgerMapComponont/KakaoMap";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";


export default function  LedgerDetail({categoryList, ledger, isOpen, open} : {categoryList : CategoryType[], ledger : LedgerType, isOpen : (value: boolean) => void, open : boolean }){

    const [price, setPrice] = useState(() => ledger.price);
    const [location, setLocation] = useState(() => ledger.location);
    const [comment, setComment] = useState(() => ledger.comment);
    const [checkedList, setCheckedList] = useState([]);
    const [categoryNo, setCategoryNo] = useState(() => ledger.categoryDto.categoryNo);
    const [ledgerType , setLedgerType] = useState(() => ledger.ledgerType)

    useEffect(() => {
        setPrice(ledger.price);
        setLocation(ledger.location);
        setComment(ledger.comment);
        setCategoryNo(ledger.categoryDto.categoryNo);
        setLedgerType(ledger.ledgerType );
    }, [ledger]);


    function ledgerUpdate(){
        let frm = $("form[name=updateLedger]").serializeArray();
        let LedgerDto: any = {}; // JSON 객체로 사용할 빈 객체 생성

        const usersDto = {
            userNo: sessionStorage.getItem("userNo"),
            userId: sessionStorage.getItem("userId")
        }

        for (let field of frm) {
            LedgerDto[field.name] = field.value;
        }

        let fileOwnerNo = LedgerDto['fileOwnerNo']

        LedgerDto["categoryDto"] = { categoryNo: categoryNo };
        LedgerDto["usersDto"] = usersDto;
        LedgerDto["location"] = location;

        axios.post("api/ledger/ledgerItemUpdate", JSON.stringify(LedgerDto),{
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {

            if(res.data === "false"){
                Swal.fire({

                    icon: 'error',
                    title: '수정이 실패 되었습니다. 관리자에게 문의 하십시요',
                    timer : 2000
                })
                return false;
            }else{

                let formData = formDataArray();
                // formData 배열이 비어있지 않고, 첫 번째 요소의 fileOwnerNo가 null이 아닌 경우에만 실행
                // @ts-ignore
                if (formData && formData.getAll('file').length > 0) {
                    // @ts-ignore
                    fileUpload(formData, String(fileOwnerNo));
                }

                Swal.fire({
                    icon: 'success',
                    title: '수정되었습니다.',
                    timer : 2000
                })
                UtilsEvent();
            }

        })
    }

    function ledgerDelete(fileOwnerNo : number){
        axios.post("/api/ledger/ledgerDelete", JSON.stringify({
            "fileOwnerNo" : fileOwnerNo
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {

            fileDelete(fileOwnerNo);

            Swal.fire({
                icon : "success",
                title : "삭제되었습니다.",
                timer : 2000
            })

            UtilsEvent();
        })
    }

    function fileDelete( fileOwnerNo : number){
        axios.post("/api/ledger/deleteFile", JSON.stringify({
            "fileOwnerNo" : fileOwnerNo
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {

        }).catch( error => {
            console.log(error);
        })
    }

    function formDataArray(){
        const file = document.getElementById("file2");

        const formData = new FormData();

        // @ts-ignore
        const fileLength = file.files.length;

        for (let i = 0; i < fileLength; i++) {
            // @ts-ignore
            formData.append('file', file.files[i]);
        }

        return formData;
    }


    /**
     *
     * @param formData - form안에 file의 정보가지고 있는 변수
     * @param fileOwnerNo - ledgerNo
     */
    function fileUpload(formData: FormData, fileOwnerNo : string){
        formData.append('fileOwnerNo', fileOwnerNo);

        axios.post("/api/ledger/uploadFile", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // "Authorization": Cookies.get("jwtCookie")
            }
        }).then(response => {
            console.log(response.data); // 서버 응답 확인용 로그
        }).catch(error => {
            console.error(error); // 오류 발생 시 콘솔에 표시
        });
    }

    /**
     *
     * @param x -좌표
     * @param y -좌표
     * @param address -상세 주소
     * @code - KakaoMap에서 받은 값을 setLocation에 넣은후 hide
     * @constructor
     */
    const LocationAppend = (x : number ,y : number, address : any) => {

        setLocation({
            x : x,
            y : y,
            address : address
        })

        // @ts-ignore
        $("#KakaoMap2").modal("hide")
    }


    /**
     *
     * @param value - fileNo의 값
     * @code - checkbox를 클릭하면 이벤트 발행, 이벤트 발생시 checkedList 안에 있는 값인지
     *          검사 있으면 넣지 않고 없으면 넣음
     * @constructor
     */
    const CheckBoxEventHandle = (value : number) => {
        // 현재 선택된 파일 목록에 추가 또는 제거
        // @ts-ignore
        if (checkedList.includes(value)) {
            setCheckedList(checkedList.filter((file) => file !== value));
        } else {
            // @ts-ignore
            setCheckedList([...checkedList, value]);
        }
    };


    /**
     *
     * @param checkdList - CheckBoxEventHandle을 통해 checkedList에 넣은 값
     * @code - checkedList에 있는 값을 서버로 전송
     */
    const deleteImageFile = () => {

        alertCustom.fire({
            title : "삭제하시겠습니까?",
            icon : "warning",
            showCancelButton : true,
            cancelButtonText : "취소",
            confirmButtonText : "삭제",
            reverseButtons : false
        }).then(res => {
            if(res.isConfirmed ){

                axios.post("/api/ledger/deleteFileItem", checkedList,{
                    headers : {
                        "Content-Type" : "application/json"
                    }
                }).then(res => {
                    alert(res.data );
                    if (res.data === 'success') {
                        alertCustom.fire({
                            title: "삭제성공",
                            icon: "success",
                            timer: 1000
                        }).then( () => {

                            UtilsEvent();
                        })


                    }else{
                        alertCustom.fire({
                            title: "삭제 실패",
                            text : "관리자에게 문의 하십시요",
                            icon: "error",
                            timer: 1000
                        })
                    }
                }).catch( error => {
                    console.log(error);

                    alertCustom.fire({
                        title: "삭제 실패",
                        text : "관리자에게 문의 하십시요",
                        icon: "error",
                        timer: 1000
                    })
                })
            }
        })
    }


    /**
     * sweetAlert를 커스텀 한 코드
     */
    const alertCustom =  Swal.mixin({
        customClass: {
            cancelButton: "btn btn-success",
            confirmButton: "btn btn-danger"
        },
        buttonsStyling : false
    })

    /**
     * @code - 모달창을 감추고 리렌더링 하는 Util 코드
     * @constructor
     */
    function UtilsEvent(){
        isOpen(false);
    }


    return (
        <>
        <Modal
            open={open}
            onClose={() => isOpen(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box className={"modalBox"}>

                <Typography id="parent-modal-title" variant="h6" component="h2" sx={{marginBottom : '20px'}}>
                    글쓰기
                </Typography>

                <form name={"updateLedger"}>
                    <div id={"parent-modal-description"}>

                        <div className={"mb30"} style={{marginBottom: "30px"}}>

                            <input type="hidden" name={"fileOwnerNo"} value={ledger.fileOwnerNo}/>
                            <input type="hidden" name={"categoryNo"} value={categoryNo}/>

                            <TextField
                                fullWidth={true}
                                id="category_no"
                                name={"category_no"}
                                select
                                label="카테고리"
                                defaultValue={"0"}
                                value={categoryNo} // 초기에 선택되어야 하는 값으로 빈 문자열을 할당
                                onChange={(e) => {
                                    setCategoryNo(parseInt(e.target.value));
                                }}
                            >
                                <MenuItem value={0}>선택</MenuItem>
                                {categoryList.map((category: CategoryType, index: number) => (
                                    <MenuItem key={index} value={category.categoryNo}>
                                        {category.content}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </div>

                        <div className={"mb30"} style={{marginBottom: "30px"}}>
                            <TextField fullWidth={true} id="ledgerType" name={"ledgerType"} select label="입/출금"
                                       defaultValue={ledger.ledgerType}
                                       value={ledgerType}
                                       onChange={(e) => setLedgerType(e.target.value)}
                            >
                                <MenuItem key={"DEPOSIT"} value={"DEPOSIT"}>출금</MenuItem>
                                <MenuItem key={"SAVE"} value={"SAVE"}>입금</MenuItem>
                            </TextField>
                        </div>

                        <div className={"mb30"} style={{marginBottom: "30px"}}>
                            <TextField className={"md30"} fullWidth={true} id="price" label="가격을 입력해 주세요"
                                       value={price}
                                       onChange={(e) => {
                                           setPrice(Number(e.target.value))
                                       }}
                                       variant="outlined" name={"price"}/>
                        </div>


                        <div className={"mb30"} style={{marginBottom: "30px"}}>
                            <KakaoMap LocationAppend={LocationAppend} location={location}/>
                        </div>

                        <div className={"mb30"} style={{marginBottom: "30px"}}>
                            <TextField className={"md30"} fullWidth={true} name={"comment"} id="floatingSpassword" variant="outlined"
                                       value={comment} onChange={e => {
                                            setComment(e.target.value)
                                        }}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <input type="file" multiple className="form-control uploadFile" id="file2" name={"file"}/>
                            <label className="input-group-text" htmlFor="file">Upload</label>
                        </div>
                        {/*fileDtoList 여부에 따라 ImageBox 출력 하기*/}
                        {ledger.filesDtoList.length > 0 && (
                            <>
                                <div className={"deleteImageFile"}>
                                    <Tooltip title={"삭제하기"}>
                                        <DeleteIcon onClick={() => deleteImageFile()}/>
                                    </Tooltip>
                                </div>
                                <div className={"ImageBox"}>
                                    {ledger.filesDtoList.map((file: FilesType) => {
                                            return (
                                                <div className={"ImageItem"} key={file.fileNo}>
                                                    <div className={"ImageCheckBox"}>
                                                        <Checkbox value={file.fileNo}
                                                                  onClick={() => CheckBoxEventHandle(file.fileNo)}/>
                                                    </div>
                                                    <img className={"ledgerImg"} src={`/image/${file.filePath}`}
                                                         alt={`File ${file.fileNo}`}/>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        )}

                    </div>
                    <div className="modal-footer">

                        <Button variant="contained" endIcon={<SendIcon/>} onClick={() => ledgerUpdate()}
                                sx={{marginRight: "10px"}}>
                            수정
                        </Button>
                        <Button variant="contained" color={"error"} startIcon={<DeleteIcon/>} sx={{marginRight: "10px"}}
                                onClick={() => ledgerDelete(ledger.fileOwnerNo)}
                        >
                            삭제
                        </Button>

                        <Button variant="contained"  color="secondary" onClick={() => isOpen(false)}>
                            취소
                        </Button>

                    </div>
                </form>
            </Box>
        </Modal>

        </>

    )
}