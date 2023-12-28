import axios from "axios";
import Swal from "sweetalert2";
import {useEffect, useState} from "react";
import {CategoryType, location} from "../../TypeList";
import "../Ledger.css"
import Ledger from "../Ledger";
import KakaoMap from "./KakaoMap";


export default function CreateLeger({ChangeEvent, categoryList} : any){

    const [location, setLocation] = useState<location>();
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

            if (field.name === 'category_no') {
                LedgerDto["categoryDto"] = {
                    categoryNo: field.value
                };
            }
        }

        console.log(location);

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

        console.log(formData);

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

        setLocation({
            x : x,
            y : y,
            address : address
        })

        console.log("x : " + x + " Y : " + y + "address : " + address   );

        // @ts-ignore
        $("#KakaoMap").modal("hide")
    }


    return(
        <>
            <div  style={css} >
                <input type={"button"} className={"btn btn-bd-primary"} value={"글쓰기"}
                       data-bs-toggle="modal"
                       data-bs-target="#addLedger"/>
            </div>
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

                                <div className="mb-3">
                                    <div className="form-floating">

                                        <select name={"category_no"} className="form-select" id="floatingSelectGrid">
                                            <option>선택</option>
                                            {categoryList.map((category : CategoryType , index : number) => {
                                                return(
                                                    <option key={index} value={category.categoryNo}>{category.content}</option>
                                                )
                                            })}
                                       </select>

                                        <label htmlFor="floatingSelectGrid">카테고리를 선택해 주세요</label>
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <select name={"ledgerType"} className="form-select" id="floatingSelectGrid">
                                        <option value="SAVE">입금</option>
                                        <option value="DEPOSIT">출금</option>
                                    </select>
                                    <label htmlFor="dw">입/출금</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" name={"price"} className="form-control" id="price"
                                           placeholder="가격을 입력해주세요"/>
                                    <label htmlFor="price">가격</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="location"
                                           placeholder="지역을 입력해주세요"
                                           value={location?.address}
                                            onClick={ () =>
                                            {
                                                setLodingEvent(lodingEvent ? false : true);
                                                // @ts-ignore
                                                $("#KakaoMap").modal("show") }
                                            }
                                            readOnly={true}
                                    />
                                    <label htmlFor="location">지역</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="text" name={"comment"} className="form-control" id="floatingSpassword"
                                           placeholder="내용을 입력해주세요"/>
                                    <label htmlFor="floatingSpassword">내용</label>
                                </div>

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