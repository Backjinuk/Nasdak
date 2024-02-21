package org.nasdakgo.nasdak.Repository.QueryDsl.Impl;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.QLedger;
import org.nasdakgo.nasdak.Repository.QueryDsl.LedgerRepositoryCustom;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
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


        return jpaQueryFactory.select(formattedDate)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo))
                .orderBy(qLedger.useDate.desc())
                .offset(startPaging)
                .limit(endPaging)
                .fetch();
    }

    @Override
    public List<Ledger> getLedgerList(String startDate, String endDate, long userNo) {
        LocalDateTime nStartDate =  LocalDateTime.parse(startDate + "T00:00:00");
        LocalDateTime nEndDate =  LocalDateTime.parse(endDate + "T23:59:59");

        return jpaQueryFactory.select(qLedger)
                .from(qLedger)
                .where(qLedger.user.userNo.eq(userNo)
                        .and(qLedger.useDate.between(nStartDate, nEndDate)))
                .fetch();
    }


}
