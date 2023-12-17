import {CategoryType, LedgerType, location} from "../TypeList";
import axios from "axios";
import {useEffect, useState} from "react";
import e from "express";
import Ledger from "./Ledger";
import Swal from "sweetalert2";

export default function  LedgerDetail({categoryList, ledger, ChangeEvent} : {categoryList : CategoryType[], ledger : LedgerType, ChangeEvent : any}){

    const [price, setPrice]             = useState(Number);
    const [dw, setDw]                   = useState(Number);
    const [location, setLocation]       = useState<location>();
    const [comment, setComment]         = useState("");

    useEffect(() => {
        setPrice(ledger.price);       setDw(ledger.dw);
        setLocation(ledger.location); setComment(ledger.comment);
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

        LedgerDto["usersDto"] = usersDto;

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
                Swal.fire({
                    icon: 'success',
                    title: '수정되었습니다.',
                    timer : 2000
                })
                UtilsEvent();
            }

        })
    }

    function ledgerDelete(fileManagerNo : number){
        axios.post("api/ledger/ledgerDelete", JSON.stringify({
            "fileManagerNo" : fileManagerNo
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {
            Swal.fire({
                icon : "success",
                title : "삭제되었습니다.",
                timer : 2000
            })

            UtilsEvent();
        })
    }

    function UtilsEvent(){
        // @ts-ignore
        $("#ledgerDetail").modal('hide');
        ChangeEvent();
    }

    return (
        <div className="modal fade " id="ledgerDetail" data-bs-keyboard="false"
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
                                    <input type="hidden" name={"fileManagerNo"} value={ledger.fileManagerNo}/>
                                    <input type="hidden" name={"categoryNo"}    value={ledger.categoryDto.categoryNo}/>
                                    <select name="category_no" className="form-select" id="floatingSelectGrid"  defaultValue={ledger.categoryDto.categoryNo}>
                                        <option value="">선택</option>
                                        {categoryList.map((category: CategoryType, index: number) => (
                                            <option key={index} value={category.categoryNo}>{category.content}</option>
                                        ))}
                                    </select>

                                    <label htmlFor="floatingSelectGrid">카테고리를 선택해 주세요</label>
                                </div>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" name={"dw"} className="form-control" id="dw"
                                       placeholder="입/출금을 입력해주세요" value={dw} onChange={(e) => {
                                    setDw(Number(e.target.value))
                                }}/>
                                <label htmlFor="dw">입/출금</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" name={"price"} className="form-control" id="price" value={price} onChange={(e) => {setPrice(Number(e.target.value))}}
                                       placeholder="가격을 입력해주세요"/>
                                <label htmlFor="price">가격</label>
                            </div>
                            {/*value={location?.x} onChange={(e) => {setLocation(e.target.value?)}}*/}
                            <div className="form-floating mb-3">
                                <input type="text" name={"location"} className="form-control" id="location"
                                       placeholder="지역을 입력해주세요"/>
                                <label htmlFor="location">지역</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="text" name={"comment"} className="form-control" id="floatingSpassword" value={comment} onChange={e => {setComment(e.target.value)}}
                                       placeholder="내용을 입력해주세요"/>
                                <label htmlFor="floatingSpassword">내용</label>
                            </div>

                            <div className="input-group mb-3">
                                <input type="file" multiple className="form-control uploadFile" id="file"/>
                                <label className="input-group-text" htmlFor="file">Upload</label>
                            </div>

                        </div>
                        <div className="modal-footer">
                            {/*onClick={() => addLedger()}*/}

                            <button type="button" className="btn btn-primary" onClick={() => ledgerUpdate()}>수정</button>
                            <button type="button" className="btn btn-danger" onClick={() => ledgerDelete(ledger.fileManagerNo)}>삭제</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> 취소
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}