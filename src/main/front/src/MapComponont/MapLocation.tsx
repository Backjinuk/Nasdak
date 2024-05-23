import { useEffect, useState } from 'react';
import './Map.css';
import { CategoryType, LedgerType, location } from '../TypeList';
import LedgerDetail from '../LedgerComponont/LedgerDetail';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from '../app/store';
import { axiosGetLedgerDetail } from '../app/slices/ledgerSilce';
import axios from "axios";
import {getJsonHeader} from "../headers";
import {getCookie} from "../Cookies";

// @ts-ignore
const {kakao} = window;

export default function MapLocation({ event, locationList }: {event : any, locationList : number[] }) {
  const dispatch = useAppDispatch();
  const ledgerSeqNumbers = useAppSelector((state: RootState) => state.ledger.ledgerSeqNumbers);
  const ledger = useAppSelector((state: RootState) => state.ledger.ledger);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [changeEvent, setChangeEvent] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const selectButton = useAppSelector((state: RootState) => state.ledger.selectButton);



  useEffect(() => {
    var markers: any[] = [];

      axios.get('/api/ledger/locationList',  {
        headers : {
          Authorization: `Bearer ${getCookie('accessToken')}`,
          'Content-Type': 'application/json',
        }}
      ).then((res) => {
        displayPlaces(res.data);

      });



    var mapContainer = document.getElementById('MapLocation'), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer as HTMLElement, mapOption);

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places: LedgerType[]) {
      var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';


      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();

      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다

        var placePosition = new kakao.maps.LatLng(places[i].location.y, places[i].location.x),
          // @ts-ignore
          marker = addMarker(placePosition, i, places[i].comment),
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해z
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        // @ts-ignore
        (function (marker, title, fileOwnerNo) {
          kakao.maps.event.addListener(marker, 'mouseover', function () {
            displayInfowindow(marker, title);
          });

          kakao.maps.event.addListener(marker, 'click', function () {
            MapLedgerDetailFn(fileOwnerNo);
            //alert(fileOwnerNo);
          });

          kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
          });

          /*                    itemEl.onmouseover =  function () {
                        displayInfowindow(marker, title);
                    };
*/

          itemEl.onclick = function () {
            displayInfowindowMoveLocation(marker, title);
          };

          itemEl.onmouseout = function () {
            infowindow.close();
          };
        })(marker, places[i].location.address, places[i].fileOwnerNo);

        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      // @ts-ignore
      listEl.appendChild(fragment);
      // @ts-ignore
      menuEl.scrollTop = 0;

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다

      map.setBounds(bounds);
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index: number, places: LedgerType) {
      var el = document.createElement('li'),
        itemStr =
          '<span class="markerbg marker_' +
          (index + 1) +
          '"></span>' +
          '<div style="display : flex;" >' +
          '   <div class="info">' +
          '       <h5>' +
          places.comment +
          '</h5>' +
          '       <span>' +
          places.location.address +
          '</span>' +
          '       <span class="tel">' +
          places.price +
          '</span>' +
          '   </div>' +
          '   <div>' +
          '      <button class="MapLedgerUpdate" value="' +
          places.fileOwnerNo +
          '">수정</button>' +
          '      <button class="MapLedgerDelete" value="' +
          places.fileOwnerNo +
          '">삭제</button>' +
          '   </div>' +
          '</div>';

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position: any, idx: number, title: undefined) {
      //let placePosition = new kakao.maps.LatLng(y, x)

      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
      var marker = new kakao.maps.Marker({
        position: position,
        image: markerImage,
        map: map,
      });

      /*
            marker.setImage(markerImage)
            marker.setPosition( position )
            marker.setMap(map);
*/
      // 지도 위에 마커를 표출합니다
      markers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker: any, title: string) {
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

    function displayInfowindowMoveLocation(marker: any, title: string) {
    console.log(marker)
      alert(title)
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);

      map.setCenter(marker.getPosition());
      map.setLevel(4);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el: HTMLElement | null) {
      // @ts-ignore
      while (el.hasChildNodes()) {
        // @ts-ignore
        el.removeChild(el.lastChild);
      }
    }
  }, [event]);

  const MapLedgerDetailFn = async (fileOwnerNo: any) => {
    try {
      await dispatch(axiosGetLedgerDetail(fileOwnerNo));
      isOpen(true);
    } catch (e) {
      Swal.fire({
        title: '에러',
        text: '관리자에게 문의 하세요',
        icon: 'error',
        confirmButtonText: '확인',
        timer: 1000,
      });

      console.log(e);
    }
  };

  const ChangeEvent = () => {
    if (changeEvent) {
      setChangeEvent(false);
    } else {
      setChangeEvent(true);
    }
  };

  const isOpen = (value: any) => {
    setOpen(value);
  };

  return (
    <>
      <div className='map_wrap'>
        <div
          id='MapLocation'
          style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}
        ></div>

        <div id='menu_wrap' className='bg_white'>
          <hr />
          <ul id='placesList'></ul>
          <div id='pagination'></div>
        </div>
      </div>

      {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open} />}
    </>
  );
}
