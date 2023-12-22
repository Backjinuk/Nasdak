import {CategoryType} from "../TypeList";
import axios from "axios";
import {useEffect, useState} from "react";
import "./Ledger.css"
import Swal from "sweetalert2";
import $ from "jquery";

export default function CreateCategory({categoryList, ChangeEvent}: any) {

    const [content, setContent] = useState('');
    const [categoryStates, setCategoryStates] = useState<any[]>([] );

    useEffect(() => {
        if (categoryList.length !== 0) {

            const filteredCategories = categoryList.filter((category: CategoryType) => category.delYn === 'Y');
            filteredCategories.forEach((category: CategoryType, index: number) => {
                handleContentChange(index, category.content, category.categoryNo);

            });
        }
    }, [categoryList ]);


    const handleContentChange = (index: number, value: string, categoryNo: number) => {
        setCategoryStates(prevStates => {
            const updatedStates = [...prevStates];

            // 만약 인덱스가 범위를 벗어나면 배열을 확장합니다.
            while (updatedStates.length <= index) {
                updatedStates.push({});
            }

            updatedStates[index] = { ...updatedStates[index], content: value, categoryNo: categoryNo };
            return updatedStates;
        });
    };



    function addCategory() {
        let frm = $("form[name=addCategory]").serializeArray();

        axios.post("api/category/addCategory", JSON.stringify({
            "content": content,
            "userNo": sessionStorage.getItem("userNo"),
            "delYn": "Y"
        }), {
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => {
            ChangeEvent();
            // @ts-ignore
            $("#updateCategory").modal("hide");
            setContent("");
        })
    }
    const css: any = {
        height: "150px", display: "flex", alignItems: "center", justifyContent: "right", marginRight: "30%"
    }


    function updateCategory(categoryNo: number, content : string) {
       axios.post("api/category/updateCategory", JSON.stringify({
               "categoryNo": categoryNo,
               "content" : content
           }),{headers : { "Content-Type" : "application/json"}
       }).then(res => {
           Swal.fire({
               icon : "success",
               title : "수정에 성공하였습니다.",
               timer : 1000
           })
           ChangeEvent();

       })


    }

    return (<div>
        <div style={css}>
           <input type={"button"} className={"btn btn-bd-primary"} value={"카테고리"}
                   data-bs-toggle="modal"
                   data-bs-target="#updateCategory"/>
        </div>
        <div className="modal fade " id="updateCategory" data-bs-keyboard="false"
             aria-labelledby="staticBackdropLabel" aria-hidden="true" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">카테고리</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <form name={"addCategory"}>
                        <div className="modal-body">
                            <div className="mb-3">

                                <div className="form-floating mb-5">
                                    <div className="input-group mb-3">
                                        <input type="text" name={"comment"} className="form-control"
                                               id="floatingSpassword"
                                               value={content} onChange={e => setContent(e.target.value)}
                                               placeholder="내용을 입력해주세요"/>
                                        <button type="button" className="btn btn-primary" onClick={addCategory}> 등록</button>
                                    </div>
                                </div>

                                <div className="form-floating">
                                    <div className="form-floating">

                                        {/*{categoryStates.map((category: CategoryType, index: number) => (*/}
                                        {/*    <div key={index}>*/}
                                        {/*        <p>Index: {index}, Content: {category.content}, CategoryNo: {category.categoryNo}</p>*/}
                                        {/*    </div>*/}
                                        {/*))}*/}

                                        {categoryStates.map((category: CategoryType, index: number) => (
                                            <div className="form-floating mb-3" key={index}>
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="text"
                                                        name={"comment"}
                                                        className="form-control categoryBox"
                                                        id={`floatingSpassword-${index}`}
                                                        value={category.content}
                                                        onChange={(e) => handleContentChange(index, e.target.value , category.categoryNo)}
                                                        placeholder="내용을 입력해주세요"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-info"
                                                        onClick={() => updateCategory(category.categoryNo, category.content)}
                                                    >
                                                        수정
                                                    </button>
                                                </div>
                                            </div>

                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> 취소
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>)
}