import {useEffect, useState} from "react";
import FindAddress from "./FindAddress";
import axios from "axios";


export default function KakaoMap({LocationAppend, lodingEvent} : any ){

    // @ts-ignore
    const {kakao} = window;

    const [x, setX] = useState(Number);
    const [y , setY] = useState(Number);
    const [address, setAddress] = useState("");
    const [lendingMap , setLendingMap] = useState(true);

    // 지도를 클릭한 위치에 표출할 마커입니다
    useEffect(() => {

        if( x == 0 && y == 0){
            FindLocalLocation();
        }

        const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(x, y), //지도의 중심좌표.
            level: 4 , //지도의 레벨(확대, 축소 정도)
            keyboardShortcuts : true
        };

        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

        if(container !== null && container !== undefined){
            container.style.width = "450px";
            container.style.height = "500px";
        }

        /**
         * 지도 위치조정 & 초기 ip주소로 위치 조회
         */
        setTimeout(() => {
            map.relayout();
            map.setLevel(4);
            if(lendingMap) {
                var moveLatLon = new kakao.maps.LatLng(y, x);

                marker.setPosition(moveLatLon);
                marker.setMap(map);

                // 지도 중심다시 설정
                map.setCenter(moveLatLon);

                if( x != 0 && y != 0){
                    setLendingMap(false );
                }
            }
        }, 1000)



        var marker = new kakao.maps.Marker();

        var infowindow = new kakao.maps.InfoWindow();

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function(result: { x: any;  y: any }[], status: any) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                const coords2 = new kakao.maps.LatLng(result[0].y, result[0].x);

                setX(result[0].x );  setY(result[0].y );

                console.log(coords2)

                // 결과값으로 받은 위치를 마커로 표시합니다
                marker.setMap(map );
                marker.setPosition(coords2 );

                const content = '<div style="width:150px;text-align:center;padding:6px 0;">'+address+'</div>';

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                infowindow.setContent(content );
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords2);
            }
        });

        // 지도에 클릭 이벤트를 등록합니다
        // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
        kakao.maps.event.addListener(map, 'click', function(mouseEvent: { latLng: any; }) {
            searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                    var content = '<div class="bAddr">' +detailAddr + '</div>';

                    // 마커를 클릭한 위치에 표시합니다
                    marker.setPosition(mouseEvent.latLng);
                    marker.setMap(map);

                    setX(mouseEvent.latLng.La ); setY(mouseEvent.latLng.Ma );

                    console.log(mouseEvent.latLng );
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                    //alert(result[0].road_address.address_name);
                    setAddress(!!result[0].road_address ? result[0].road_address.address_name  : result[0].address.address_name);
                }
            });

        });

        function searchDetailAddrFromCoords(coords: { getLng: () => any; getLat: () => any; }, callback: (result: any, status: any) => void) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

    }, [address, lodingEvent]);

    const ChangeAddress = (data : string) => {
        setAddress(data);
    }

    /**
     * @prarm - uri
     * @code - ip주소를 이용하여 현재 위치를 알려주는 api
     */
    const FindLocalLocation = async () => {

        const location = await axios.get('https://geolocation-db.com/json/')

        axios.post(`http://ip-api.com/json/${location.data.IPv4}`
        ).then(res => {
            console.log(res.data)
            setY(res.data.lat); setX(res.data.lon);
        }).catch(error => {
            console.log(error)
        })
    }

    return(
        <div className="modal fade " id="KakaoMap" data-bs-keyboard="false"
             aria-labelledby="staticBackdropLabel" aria-hidden="true" tabIndex={-2}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{height : ""}}>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">지도</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div id="map" className={"kakaoMap"} style={{width: "470px", height: "470px"}}></div>

                        <FindAddress ChangeAddress={ChangeAddress} address={address} />
                        <div className={"kakaoMapButtonBox"}>
                            <button type="button" className="btn btn-primary" onClick={() => LocationAppend( x, y, address)}>완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}