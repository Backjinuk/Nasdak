import { LedgerType } from '../TypeList';
import { ReactNode, useState } from 'react';
import LedgerDetailModal from './LedgerDetailModal';
import axios from '../customFunction/customAxios';
import Button from '@mui/material/Button';
import { axiosGetLedgerAllDay } from '../app/slices/ledgerSilce';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import Swal from 'sweetalert2';
import { ChangeMaxPage } from '../app/slices/ledgerSilce';
import StatsViewBar from './StatsViewBar';
import { AnimatePresence, motion } from 'framer-motion';
import StatsViewPie from "./StatsViewPie";

interface LedgerProps {
  ledgerData: LedgerType[];
}

export default function Ledger({
  ledgerData,
  ledgerDetail,
  date,
  isOpen,
  selectButton,
  nextPlease,
  prevPlease,
}: {
  ledgerData: LedgerType[];
  ledgerDetail: any;
  date: string;
  isOpen: any;
  selectButton: number;
  nextPlease: () => void;
  prevPlease: () => void;
}) {
  const dispatch = useAppDispatch();
  const [open2, setOpen2] = useState(false);
  const [ledgerList, setLedgerList] = useState<LedgerType[]>(ledgerData);
  const ledgerAllList = useAppSelector((state: RootState) => state.ledger.ledgerList);
  const maxPage = useAppSelector((state: RootState) => state.ledger.maxPage);
  const [stateOpen, setStateOpen] = useState(false);
  const [statsView, setStatsView] = useState("Bar");


  function isOpen2(value: boolean) {
    setOpen2(value);
  }

  async function ledgerDate(value: string) {
    const res = await axios.post(
      '/api/ledger/ledgerDateList',
      JSON.stringify({
        date: value,
        userNo: parseInt(sessionStorage.getItem('userNo') as string) as number,
      })
    );

    setLedgerList(res.data);
    isOpen2(true);
  }

  const searchDate = (date: string, type: string) => {
    const keys = Object.entries(ledgerAllList);
    const index = Object.keys(ledgerAllList).indexOf(date) + 1;
    let value = selectButton === 1 ? 'Day' : selectButton === 2 ? 'Week' : selectButton === 3 ? 'Month' : 'Month3';

    if (type === 'PREV') {
      if (index > 0 && index < keys.length) {
        const startDate = Object.keys(ledgerAllList)[index].split('~')[0].trim();

        if (keys.length <= index + 2) {
          dispatch(
            axiosGetLedgerAllDay({
              userNo: parseInt(sessionStorage.getItem('userNo') as string) as number,
              searchKey: value,
              startPage: 0,
              endPage: 0,
              startDate: startDate,
              type: type,
            })
          );
        }
        dispatch(ChangeMaxPage(keys.length));
        nextPlease();
      } else {
        Swal.fire({
          icon: 'info',
          title: '데이터가 존재하지 않습니다.',
          timer: 1000,
        });
      }
    } else {
      if (index === 1) {
        Swal.fire({
          icon: 'info',
          title: '데이터가 존재하지 않습니다.',
          timer: 1000,
        });
      } else {
        prevPlease();
      }
    }
  };


  const changeStateView = (value : string) => {
    setStatsView(value);
  }

  return (
    <>
      <div className={'itemWarp'}>
        <div className={'ledgerBoxTop'}>{date}</div>
        {selectButton == 1 && (
          <div className={'ledgerBoxBody'}>
            {ledgerData.map((ledger, index) => (
              <div
                className={'ledgerItem'}
                key={index}
                onClick={() => {
                  ledgerDetail(ledger.fileOwnerNo);
                }}
              >
                <div> 날짜 : {new Date(ledger.useDate).toLocaleDateString()} </div>
                <div>
                  {' '}
                  {ledger.ledgerType === 'SAVE' ? '입금' : '출금'} : {ledger.price}{' '}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectButton != 1 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                variant={'contained'}
                onClick={() => {
                  setStateOpen(!stateOpen);
                }}
                sx={{ height: '32px', position: 'absolute', top: '5px' }}
              >
                통계보기
              </Button>
            </div>
            <AnimatePresence>
              {stateOpen && (
                <motion.div
                  layout // layout 속성 추가
                  initial={{ opacity: 0, x: -500 }} // 컴포넌트가 처음 렌더링될 때의 상태
                  animate={{ opacity: 1, x: 0 }} // 애니메이션의 최종 상태
                  exit={{ opacity: 0, x: 500 }} // 컴포넌트가 사라질 때의 상태
                  transition={{ duration: 0.5, delay: 0 }} // 애니메이션 동작 시간
                >
                  <motion.div layout>
                    {statsView === 'Bar' && <StatsViewBar ledgerAllList={ledgerAllList} date={date} setStatsView={setStatsView} />}
                    {statsView === 'Pie' && <StatsViewPie ledgerAllList={ledgerAllList} date={date} setStatsView ={setStatsView }/>}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={'ledgerBoxBody2'}>
              {ledgerData.map((ledger, index) => (
                <div
                  className={'ledgerItem2'}
                  key={index}
                  onClick={() => {
                    ledgerDate(ledger.useDate).then();
                  }}
                >
                  <div> 날짜 : {ledger.useDate} </div>
                  <div>
                    {ledger.ledgerType === 'SAVE' ? '입금' : '출금'} : {ledger.price}{' '}
                  </div>
                  <div>
                    {ledger.ledgerType2 === 'DEPOSIT' ? '입금' : '출금'} : {ledger.price2}{' '}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {ledgerList && (
          <LedgerDetailModal ledgerList={ledgerList} isOpen2={isOpen2} open2={open2} ledgerDetail={ledgerDetail} />
        )}
      </div>

      {selectButton != 1 && (
        <div className={'flex-box'}>
          <Button variant={'contained'} onClick={() => searchDate(date, 'NEXT')}>
            NEXT
          </Button>

          <Button variant={'contained'} onClick={() => searchDate(date, 'PREV')}>
            PREV
          </Button>
        </div>
      )}
    </>
  );
}
