import { useEffect, useState } from 'react';
import './Map.css';
import { LedgerType } from "../TypeList";
import { axiosGetLedgerDetail } from "../app/slices/ledgerSilce";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Swal from "sweetalert2";
import { RootState } from "../app/store";
import {resolve} from "chart.js/helpers";


// @ts-ignore
const { kakao } = window;

export default function StateMapLocation() {
  const dispatch = useAppDispatch();
  const ledgerSeqNumbers = useAppSelector((state: RootState) => state.ledger.ledgerSeqNumbers);
  const [infowindow, setInfowindow] = useState<kakao.maps.InfoWindow | null>(null);
  const [map, setMap] = useState<kakao.maps.Map | undefined>();
  const [open, setOpen] = useState(false);
  let markers: kakao.maps.Marker[] = [];

  useEffect(() => {
    const mapContainer = document.getElementById('MapLocation2'); // 지도를 표시할 div
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심 좌표 (서울)
      level: 1, // 지도의 확대 레벨
    };


    if (kakao && kakao.maps && mapContainer) {
      const newMap = new kakao.maps.Map(mapContainer, mapOption);
      const newInfowindow = new kakao.maps.InfoWindow({zIndex: 1});

      setMap(newMap);
      setInfowindow(newInfowindow);
  }
  }, [])

  useEffect(() => {
    const triggerClick = async () => {
      if (map && infowindow) {

        setTimeout(async () => {
          await displayPlaces(ledgerSeqNumbers);
          $('.markerbg.marker_1').click();
        }, 500);

      }
    }
    triggerClick().then(r => {return;});
  }, [map, infowindow, ledgerSeqNumbers])

  function displayPlaces(places: LedgerType[]) :  Promise<void> {
    return new Promise( (resolve) => {

    const listEl = document.getElementById('placesList');
    const menuEl = document.getElementById('menu_wrap');
    const fragment = document.createDocumentFragment();
    const bounds = new kakao.maps.LatLngBounds();

    removeAllChildNodes(listEl);
    removeMarker();

    places.forEach((place, i) => {
      const placePosition = new kakao.maps.LatLng(place.location.y, place.location.x);
      const marker = addMarker(placePosition, i, place.comment);
      const itemEl = getListItem(i, place); // 검색 결과 항목 Element를 생성합니다

      bounds.extend(placePosition);

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        displayInfowindow(marker, place.location.address);
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        MapLedgerDetailFn(place.fileOwnerNo);
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        if (infowindow) {
          infowindow.close();
        }
      });

      itemEl.onclick = () => {
        displayInfowindowMoveLocation(marker, place.location.address);
      };

      itemEl.onmouseout = () => {
        if (infowindow) {
          infowindow.close();
        }
      };

      fragment.appendChild(itemEl);
    });

    if (listEl && menuEl) {
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;
    }

    if (map) {
      map.setBounds(bounds);
    }

     resolve(); // 프라미스를 완료합니다.
    })
  }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index: number, place: LedgerType) {
      const el = document.createElement('li');
      const itemStr = `
      <span class="markerbg marker_${index + 1}"></span>
      <div style="display: flex;">
        <div class="info">
          <h5>${place.comment}</h5>
          <span>${place.location.address}</span>
          <span class="tel">${place.price}</span>
        </div>
        <div>
          <button class="MapLedgerUpdate" value="${place.fileOwnerNo}">수정</button>
          <button class="MapLedgerDelete" value="${place.fileOwnerNo}">삭제</button>
        </div>
      </div>
    `;
      el.innerHTML = itemStr;
      el.className = 'item';
      return el;
    }

    function addMarker(position: kakao.maps.LatLng, idx: number, title: string) {
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'; // 마커 이미지 url
      const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
        map: map,
      });

      markers.push(marker); // 배열에 생성된 마커를 추가합니다
      return marker;
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker: kakao.maps.Marker, title: string) {
      const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
      if (infowindow && map) {
        infowindow.setContent(content);
        infowindow.open(map, marker);
      }
    }

    function displayInfowindowMoveLocation(marker: kakao.maps.Marker, title: string) {
      const content = `<div style="padding:5px;z-index:1;">${title}</div>`;

      if (infowindow && map) {
        infowindow.setContent(content);
        infowindow.open(map, marker);
        map.setCenter(marker.getPosition());
        map.setLevel(4);
      }
    }

    function removeAllChildNodes(el: HTMLElement | null) {
      if (el) {
        while (el.hasChildNodes()) {
          el.removeChild(el.lastChild as Node);
        }
      }
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      markers.forEach(marker => marker.setMap(null));
      markers = [];
    }

    const MapLedgerDetailFn = async (fileOwnerNo: number) => {
      try {
        await dispatch(axiosGetLedgerDetail(fileOwnerNo));
        isOpen(true);
      } catch (e) {
        await Swal.fire({
          title: '에러',
          text: '관리자에게 문의 하세요',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 1000,
        });
        console.log(e);
      }
    };

    const isOpen = (value: boolean) => {
      setOpen(value);
    };



    return (
        <>
          <div className='map_wrap'>
            <div
                id='MapLocation2'
                style={{width: '100%', height: '100vh', position: 'relative', overflow: 'hidden'}}
            ></div>

            <div id='menu_wrap' className='bg_white'>
              <hr/>
              <ul id='placesList'></ul>
              <div id='pagination'></div>
            </div>
          </div>
        </>
    )
  }
