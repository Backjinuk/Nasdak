package org.nasdakgo.nasdak.Repository.QueryDsl.Impl;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.QLedger;
import org.nasdakgo.nasdak.Repository.QueryDsl.LedgerRepositoryCustom;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class LedgerRepositoryCustomImpl implements LedgerRepositoryCustom {


    private final JPAQueryFactory jpaQueryFactory;
    private final QLedger qLedger = QLedger.ledger;


    @Override
    @Transactional
    public List<String> getLedgerDateList(long userNo, int startPaging, int endPaging) {

        DateTemplate<String> formattedDate = Expressions.dateTemplate(
                String.class
                , "DATE_FORMAT({0}, {1})"
                , qLedger.useDate
                , ConstantImpl.create("%Y-%m-%d"));

//        DateTemplate<String> formattedDate = Expressions.dateTemplate(
//                String.class
//                , "DATE_FORMAT({0}, {1})"
//                , qLedger.useDate
//                , ConstantImpl.create("yyyy-MM-dd"));


        return jpaQueryFactory.select(formattedDate)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo))
                .orderBy(qLedger.useDate.desc())
                .offset(startPaging)
                .limit(endPaging)
                .fetch();
    }

    @Override
    public List<Ledger> getLedgerList(LocalDate startDate, LocalDate endDate, long userNo) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        String start = startDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String end = endDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        DateTemplate<String> formattedDate = Expressions.dateTemplate(
                String.class
                , "DATE_FORMAT({0}, {1})"
                , qLedger.useDate
                , ConstantImpl.create("%Y-%m-%d %H:%i:%s")); // useDate 스트링으로 변환

        return jpaQueryFactory
                .select(qLedger)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo)
                        .and(formattedDate.between(start, end))) //String 끼리 비교 (Date는 안됨 겁나 오래 걸림)
                .fetch();
    }


}
