package org.nasdakgo.nasdak.Repository.QueryDsl;

import org.nasdakgo.nasdak.Entity.Ledger;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LedgerRepositoryCustom {


    List<String> getLedgerDateList(long userNo, int startPaging, int endPaging);

    List<Ledger> getLedgerList(LocalDate startDate, LocalDate endDate, long userNo);

    LocalDateTime getLedgerSearchDate(LocalDate startDate, long userNo);



}
