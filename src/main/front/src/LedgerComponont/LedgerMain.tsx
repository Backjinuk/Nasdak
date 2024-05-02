import Ledger from "./Ledger"
import {useEffect, useState} from "react";
import "./Ledger.css";
import * as React from "react";
import {axiosGetLedgerAllDay, axiosGetLedgerDetail, ChangePage, ChangeSelectButton} from "../app/slices/ledgerSilce";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import LedgerDetail from "./LedgerDetail";
import Button from "@mui/material/Button";
import { useInView } from 'react-intersection-observer';
import {AnimatePresence, motion, useAnimation, useMotionValue, useTransform} from "framer-motion";
import {SlideWrap, Wrapper, Box} from "./StyleComponent";
export default function LedgerMain({categoryList , event} : any){

    const dispatch= useAppDispatch();
    const ledgerList = useAppSelector((state : RootState) => state.ledger.ledgerList);
    const ledger = useAppSelector((state : RootState) => state.ledger.ledger) ;
    const [open, setOpen] = useState<boolean>(false);
    const selectButtonValue = useAppSelector((state : RootState) => state.ledger.selectButton);
    const startPage = useAppSelector((state : RootState) => state.ledger.startPage);
    const endPage = useAppSelector((state : RootState) => state.ledger.endPage);
    const [visible, setVisible] = useState<number>(0);
    const [back, setBack] = useState(false);

    const [ref, inView] = useInView({
        triggerOnce :false,
        threshold: 0.1,
        onChange: (inView) => {
            if(inView){
                nextPage();
                ChangePageType();
            }

        }
    }); // 무한 스크롤링을 위한 라이브러리


    useEffect(() => {
        nextPage();
        ChangePageType();
    }, [event, selectButtonValue]);

    function nextPage() {
        let value = selectButtonValue === 1 ?  "Day" : selectButtonValue === 2 ?  "Week" : selectButtonValue === 3 ?  "Month" : "Month3";
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: value,
            startPage: startPage,
            endPage: endPage,
            startDate : "",
            type : ""
        }));
    }

    function ChangePageType(){
        switch (selectButtonValue) {
            case 1 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 5})); break;
            case 2 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 7})); break;
            case 3 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 30})); break;
            case 4 : dispatch(ChangePage({startPage: startPage + endPage, endPage: endPage + 90})); break;
        }
    }

    function nextView(){
        $(".nextView").css("display", "none");

        setTimeout(() => {
            $(".nextView").css("display", "block");
        },1000);
    }

    function ledgerDetail(key  : number){
        isOpen(true);
        dispatch(axiosGetLedgerDetail(key));
    }

    const isOpen = (value : boolean) => {
        setOpen(value);
        return value;
    }

    function searchLedger(value : number){
        dispatch(ChangeSelectButton(value));
        let value2 = value === 1 ?  "Day" : value === 2 ?  "Week" : value === 3 ?  "Month" : "Month3";
        dispatch(axiosGetLedgerAllDay({
            userNo: parseInt(sessionStorage.getItem("userNo") as string) as number,
            searchKey: value2,
            startPage: startPage,
            endPage: endPage,
            startDate : "",
            type : ""
        }));
    }

    const boxVariants = {
        entry: (back: boolean) => ({
            x: back ? -800 : 800,
            opacity: 0,
            scale: 0,
            height: 0
        }),
        center: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.5 },
            height: "auto",
        },
        exit: (back: boolean) => ({
            x: back ? 800 : -800,
            opacity: 0,
            scale: 0,
            height: 0,
            transition: { type: "bounce", duration: 0.4, mass: 0.5},
        })
    };

    const nextPlease = () => {
        setBack(false);
        setVisible((prev) =>
            prev === Object.entries(ledgerList).length - 1 ? Object.entries(ledgerList).length - 1 : prev + 1
        );
    };

    const prevPlease = () => {
        setBack(true);
        setVisible((prev) => (prev === 0 ? 0 : prev - 1));
    };

    return(
        <div>
            <div className={"warp"}>
                <div className={"search-tag-result"}>
                    <Button variant={selectButtonValue == 1 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(1)}>일자별 보기</Button>
                    <Button variant={selectButtonValue == 2 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(2)}>1주일별 보기</Button>
                    <Button variant={selectButtonValue == 3 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(3)}>1개월별 보기</Button>
                    <Button variant={selectButtonValue == 4 ? "outlined" : "contained"} sx={{marginRight: 2}}
                            onClick={() => searchLedger(4)}>3개월별 보기</Button>
                </div>
                {selectButtonValue === 1 &&
                    <>
                        {Object.entries(ledgerList).map(([date, ledgerData], index) => (
                            <motion.div
                                className={"card shadow-lg"}
                                key={index}
                                initial={{ opacity: 0, y: -500 }} // 컴포넌트가 처음 렌더링될 때의 상태
                                animate={{ opacity: 1, y: 0 }} // 애니메이션의 최종 상태
                                transition={{ duration: 0.5, delay: 0 }} // 애니메이션 동작 시간
                            >
                                <Ledger
                                    date={date}
                                    isOpen={isOpen}
                                    ledgerData={ledgerData}
                                    ledgerDetail={ledgerDetail}
                                    nextPlease={nextPlease}
                                    prevPlease={prevPlease}
                                    selectButton={selectButtonValue}
                                />
                            </motion.div>
                        ))}
                    </>
                }

                {selectButtonValue != 1 &&
                    <Wrapper>
                        <SlideWrap>
                            <AnimatePresence custom={back}>
                                {Object.entries(ledgerList).map(([date, ledgerData], index) => (
                                    visible === index && (
                                        <Box
                                            layout
                                            custom={back}
                                            variants={boxVariants}
                                            initial={"entry"}
                                            animate={"center"}
                                            exit={"exit"}
                                            key={index}
                                        >
                                            <motion.div layout className={"card2 shadow-lg"}>
                                                <Ledger
                                                    date={date}
                                                    isOpen={isOpen}
                                                    ledgerData={ledgerData}
                                                    ledgerDetail={ledgerDetail}
                                                    selectButton={selectButtonValue}
                                                    nextPlease={nextPlease}
                                                    prevPlease={prevPlease}
                                                />
                                            </motion.div>
                                        </Box> )
                                ))}

                            </AnimatePresence>
                        </SlideWrap>
                    </Wrapper>
                }
                {ledger && <LedgerDetail categoryList={categoryList} ledger={ledger} isOpen={isOpen} open={open}/>}

                {selectButtonValue === 1 &&
                    <>
                        {/* <input type="button" value="next" onClick={() => nextView()}/> */}
                        <div className={"nextView"} ref={ref}>-</div>
                    </>
                }
            </div>
        </div>
    )
}
