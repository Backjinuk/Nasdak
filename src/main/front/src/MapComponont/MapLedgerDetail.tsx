import {CategoryType, FilesType, LedgerType, location} from "../TypeList";
import axios from "axios";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

export default function  LedgerDetail({categoryList, ledger} : {categoryList : CategoryType[], ledger : LedgerType}){

    const [price, setPrice] = useState(() => ledger.price);
    const [location, setLocation] = useState(() => ledger.location);
    const [comment, setComment] = useState(() => ledger.comment);
    const [lodinMap, setLodingMap] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    useEffect(() => {
        setPrice(ledger.price);
        setLocation(ledger.location);
        setComment(ledger.comment);
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

            if (field.name === 'category_no') {
                LedgerDto["categoryDto"] = {
                    categoryNo: field.value
                };
            }
        }

        let fileOwnerNo = LedgerDto['fileOwnerNo']

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
                if (formData.length > 0) {
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
        // @ts-ignore
        $("#ledgerDetail").modal('hide');
        //ChangeEvent();
    }


    return (
        <>
        <div className="modal fade " id="MapLedgerDetail" data-bs-keyboard="false"
             aria-labelledby="staticBackdropLabel" aria-hidden="true" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">글쓰기</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <form name={"updateLedger"}>
                        <div className="modal-body">

                            <div className="mb-3">
                                <div className="form-floating">
                                    <input type="hidden" name={"fileOwnerNo"} value={ledger.fileOwnerNo}/>
                                    <input type="hidden" name={"categoryNo"} value={ledger.categoryDto.categoryNo}/>
                                    <select name="category_no" className="form-select" id="floatingSelectGrid"
                                            defaultValue={ledger.categoryDto.categoryNo}>
                                        <option value="">선택</option>
                                        {categoryList.map((category: CategoryType, index: number) => (
                                            <option key={index} value={category.categoryNo}>{category.content}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="floatingSelectGrid">카테고리를 선택해 주세요</label>
                                </div>
                            </div>

                            <div className="form-floating mb-3">
                                <select name={"ledgerType"} className="form-select" id="floatingSelectGrid"
                                        defaultValue={ledger.ledgerType}>
                                    <option value="SAVE">입금</option>
                                    <option value="DEPOSIT">출금</option>
                                </select>
                                <label htmlFor="dw">입/출금</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" name={"price"} className="form-control" id="price" value={price}
                                       onChange={(e) => {
                                           setPrice(Number(e.target.value))
                                       }}
                                       placeholder="가격을 입력해주세요"/>
                                <label htmlFor="price">가격</label>
                            </div>
                            {/*value={location?.x} onChange={(e) => {setLocation(e.target.value?)}}*/}
                            <div className="form-floating mb-3">
                                <input type="text" name={"location"} className="form-control" id="location"
                                       onClick={() => {
                                           setLodingMap(lodinMap ? false : true);
                                           // @ts-ignore
                                           $("#KakaoMap2").modal("show")
                                       }}
                                       placeholder="지역을 입력해주세요" value={location.address}
                                       readOnly={true}
                                />
                                <label htmlFor="location">지역</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" name={"comment"} className="form-control" id="floatingSpassword"
                                       value={comment} onChange={e => {
                                    setComment(e.target.value)
                                }}
                                       placeholder="내용을 입력해주세요"/>
                                <label htmlFor="floatingSpassword">내용</label>
                            </div>

                            <div className="input-group mb-3">
                                <input type="file" multiple className="form-control uploadFile" id="file2"
                                       name={"file"}/>
                                <label className="input-group-text" htmlFor="file">Upload</label>
                            </div>
                            {/*fileDtoList 여부에 따라 ImageBox 출력 하기*/}
                            {ledger && ledger.filesDtoList.length > 0 && (
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

                            <button type="button" className="btn btn-primary" onClick={() => ledgerUpdate()}>수정</button>
                            <button type="button" className="btn btn-danger"
                                    onClick={() => ledgerDelete(ledger.fileOwnerNo)}>삭제
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> 목록</button>

                        </div>
                    </form>
                </div>
            </div>
        </div>

        </>

    )
}