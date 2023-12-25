import $ from "jquery";



export default function FindAddress({ChangeAddress} : any) {


    // @ts-ignore
    const {daum} = window;

    function sample6_execDaumPostcode() {

        new daum.Postcode({
            oncomplete: function(data: { userSelectedType: string; roadAddress: string; jibunAddress: string; bname: string; buildingName: string; apartment: string; zonecode: any; }) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                // @ts-ignore
                document.getElementById('sample6_postcode').value = data.zonecode;
                // @ts-ignore
                document.getElementById("sample6_address").value = addr;
                // 커서를 상세주소 필드로 이동한다.
                // @ts-ignore
                document.getElementById("sample6_detailAddress").focus();
            }
        }).open();
    }

    function findAddress() {
        // @ts-ignore
        var address = $("#sample6_address").val() + " " + $("#sample6_detailAddress").val();


        ChangeAddress(address);
    }

    return (
        <div className={"findAddress"}>

            <div className="input-group mb-3">
                <input type="text" id={"sample6_postcode"} className="form-control" placeholder="우편번호"
                       aria-label="Recipient's username" aria-describedby="sample6_execDaumPostcode"/>
                <button className="btn btn-outline-secondary" type="button" id="sample6_execDaumPostcode"
                        onClick={() => sample6_execDaumPostcode()}> 우편번호 찾기
                </button>
            </div>

            <div className="input-group mb-3">
                <input type="text" id={"sample6_address"} className="form-control" placeholder="주소"/>
            </div>

            <div className="input-group mb-3">
                <input type="text" id={"sample6_detailAddress"} className="form-control" placeholder="상세주소"
                       aria-label="Recipient's username" aria-describedby="sample6_detailAddress"/>
                <button className="btn btn-outline-secondary" type="button" id="sample6_detailAddress"
                        onClick={() => findAddress()}> 확인
                </button>
            </div>

        </div>
    )
}


