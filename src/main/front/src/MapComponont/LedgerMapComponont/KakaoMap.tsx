import {useEffect, useRef, useState} from "react";
import FindAddress from "./FindAddress";
import axios from "axios";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {location} from "../../TypeList";
import "../../LedgerComponont/Ledger.css"
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";


export default function KakaoMap({location, LocationAppend} : {LocationAppend : any,location : location} ){

    // @ts-ignore
    const {kakao} = window;

    const [x, setX] = useState(location.x);
    const [y , setY] = useState(location.y);
    const [address, setAddress] = useState(location.address);
    const [lendingMap , setLendingMap] = useState(true);
    const [open , setOpen] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [lodingEvent, setLodingEvent] = useState(true);


    useEffect(() => {



            // ref.current가 존재할 때 Kakao Map 초기화
            if (mapContainerRef.current) {


                if (x == 0 && y == 0) {
                    FindLocalLocation();
                }

                const container = mapContainerRef.current;
                const options = {
                    center: new kakao.maps.LatLng(x, y),
                    level: 4,
                    keyboardShortcuts: true
                };

                const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

                if (container !== null && container !== undefined) {
                    container.style.width = "100%";
                    container.style.height = "500px";
                }

                /**
                 * 지도 위치조정 & 초기 ip주소로 위치 조회
                 */

                setTimeout(() => {
                    map.relayout();
                    map.setLevel(4);
   /*                 if (lendingMap) {*/
                        var moveLatLon = new kakao.maps.LatLng(y, x);

                        marker.setPosition(moveLatLon);
                        marker.setMap(map);

                        // 지도 중심다시 설정
                        map.setCenter(moveLatLon);
/*
                        if (x != 0 && y != 0) {
                            setLendingMap(false);
                        }
                    }*/
                }, 100)


                var marker = new kakao.maps.Marker();

                var infowindow = new kakao.maps.InfoWindow();

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();

                if(address != ""){
                    geocoder.addressSearch(address, function (result: { x: any; y: any }[], status: any) {

                        // 정상적으로 검색이 완료됐으면
                        if (status === kakao.maps.services.Status.OK) {

                            const coords2 = new kakao.maps.LatLng(result[0].y, result[0].x);

                            setX(result[0].x);
                            setY(result[0].y);

                            // 결과값으로 받은 위치를 마커로 표시합니다
                            marker.setMap(map);
                            marker.setPosition(coords2);

                            const content = '<div style="width:150px;text-align:center;padding:6px 0;">' + address + '</div>';

                            // 인포윈도우로 장소에 대한 설명을 표시합니다
                            infowindow.setContent(content);
                            infowindow.open(map, marker);

                            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                            map.setCenter(coords2);
                        }
                    });
                }



                // 지도에 클릭 이벤트를 등록합니다
                // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
                kakao.maps.event.addListener(map, 'click', function (mouseEvent: { latLng: any; }) {
                    searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                            detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                            var content = '<div class="bAddr">' + detailAddr + '</div>';

                            // 마커를 클릭한 위치에 표시합니다
                            marker.setPosition(mouseEvent.latLng);
                            marker.setMap(map);

                            setX(mouseEvent.latLng.La);
                            setY(mouseEvent.latLng.Ma);

                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                            //alert(result[0].road_address.address_name);
                            setAddress(!!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name);
                        }
                    });

                });

                // @ts-ignore
                function searchDetailAddrFromCoords(coords: {
                    getLng: () => any;
                    getLat: () => any;
                }, callback: (result: any, status: any) => void) {
                    // 좌표로 법정동 상세 주소 정보를 요청합니다
                    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
                }
            }
    }, [address, lodingEvent, x, y]);

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
            setY(res.data.lat); setX(res.data.lon);
        }).catch(error => {
            console.log(error)
        })
    }


    return(
        <>
            <TextField className={"md30"} fullWidth={true} id="location" label="지역을 입력해 주세요"
                       variant="outlined" value={location?.address}
                       onMouseDown={() => {
                           setLodingEvent(lodingEvent ? false : true);
                           setOpen(true);
                       }}

                       onFocus={() =>{
                           setLodingEvent(lodingEvent ? false : true);
                           setOpen(true);
                       }}

            />

                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box className={"modalBox"} >
                        <Typography id="child-modal-title" variant="h6" component="h2" sx={{marginBottom : '20px'}}>
                            지도
                        </Typography>
                        <div className="">
                            <div ref={mapContainerRef} id="map" className={"kakaoMap"} ></div>

                            <FindAddress ChangeAddress={ChangeAddress} address={address} />
                            <div className={"kakaoMapButtonBox"}>
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    LocationAppend( x, y, address);
                                    setOpen(false)
                                }}>완료</button>
                            </div>
                        </div>
                    </Box>
                </Modal>
        </>
    )
}