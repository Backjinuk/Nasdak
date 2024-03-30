package org.nasdakgo.nasdak.Repository.QueryDsl.Impl;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.QLedger;
import org.nasdakgo.nasdak.Repository.QueryDsl.LedgerRepositoryCustom;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class LedgerRepositoryCustomImpl implements LedgerRepositoryCustom {


    private final JPAQueryFactory jpaQueryFactory;
    private final QLedger qLedger = QLedger.ledger;


    @Override
    @Transactional
    public List<String> getLedgerDateList(long userNo, int startPaging, int endPaging) {

        DateTemplate<String> formattedDate2 = createFormattedDate2();

        return jpaQueryFactory
                .selectDistinct(formattedDate2)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo))
                .offset(startPaging)
                .limit((startPaging == 0) ? endPaging : startPaging)
                .orderBy(formattedDate2.desc())
                .fetch();
    }

    @Override
    public List<Ledger> getLedgerList(LocalDate startDate, LocalDate endDate, long userNo) {

        Map<String, Object> map = transDate(startDate, endDate);

        DateTemplate<String> formattedDate = createFormattedDate();

        return jpaQueryFactory
                .select(qLedger)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo)
                        .and(formattedDate.between(String.valueOf(map.get("start")), String.valueOf(map.get("end"))))) //String 끼리 비교 (Date는 안됨 겁나 오래 걸림)
                .fetch();
    }

    @Override
    public LocalDateTime getLedgerSearchDate(LocalDate startDate, long userNo) {

        Map<String, Object> map = transDate(startDate, LocalDate.now());

        DateTemplate<String> formattedDate = createFormattedDate();

        return jpaQueryFactory
                .select(qLedger.useDate)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo)
                        .and(formattedDate.loe(String.valueOf(map.get("start"))))
                )
                .orderBy(qLedger.useDate.desc())
                .fetchFirst();
    }

    @Override
    public List<Ledger> getLedgerItem(String regDate, String regDate2, long userNo) {

        Map<String, Object> map = transDate(LocalDate.parse(regDate), LocalDate.parse(regDate2));

        DateTemplate<String> formattedDate = createFormattedDate();

        return jpaQueryFactory
                .select(qLedger)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo)
                        .and(formattedDate.between(
                                String.valueOf(map.get("start")),
                                String.valueOf(map.get("end")))
                        )
                )
                .orderBy(qLedger.useDate.desc())
                .fetch();
    }

    @Override
    public List<Ledger> getLedgerDayList(List<String> regDates, long userNo) {
        List<Ledger> ledgers = new ArrayList<>();

        for (String regDate : regDates) {
            Map<String, Object> map = transDate(LocalDate.parse(regDate), LocalDate.parse(regDate));

            DateTemplate<String> formattedDate = Expressions.dateTemplate(
                    String.class
                    , "DATE_FORMAT({0}, {1})"
                    , qLedger.useDate
                    , ConstantImpl.create("%Y-%m-%d %H:%i:%s")); // useDate 스트링으로 변환

            List<Ledger> ledgerList = jpaQueryFactory
                    .select(qLedger)
                    .from(qLedger)
                    .where(qLedger.user.userNo.eq(userNo)
                            .and(formattedDate.between(
                                    String.valueOf(map.get("start")),
                                    String.valueOf(map.get("end")))
                            )
                    )
                    .orderBy(qLedger.useDate.desc())
                    .fetch();

            ledgers.addAll(ledgerList);
        }

        return ledgers;
    }






    public Map<String,Object> transDate(LocalDate startDate, LocalDate endDate) {
        Map<String,Object> map = new HashMap<>();
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        String start = startDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String end = endDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        map.put("start",start);
        map.put("end",end);

        return map;
    }

    private DateTemplate<String> createFormattedDate() {

//        return DateTemplate<String> formattedDate = Expressions.dateTemplate(
//                String.class,
//                "TO_CHAR({0}, 'yyyy-MM-dd HH:mm:ss')",
//                qLedger.useDate);
//

        return Expressions.dateTemplate(
                String.class
                , "DATE_FORMAT({0}, {1})"
                , qLedger.useDate
                , ConstantImpl.create("%Y-%m-%d %H:%i:%s"));
    }

    private DateTemplate<String> createFormattedDate2() {

//        DateTemplate<String> formattedDate = Expressions.dateTemplate(
//                String.class,
//                "TO_CHAR({0}, 'yyyy-MM-dd')",
//                qLedger.useDate
//        ); // useDate 스트링으로 변환



        return Expressions.dateTemplate(
                String.class
                , "DATE_FORMAT({0}, {1})"
                , qLedger.useDate
                , ConstantImpl.create("%Y-%m-%d"));
    }


}
