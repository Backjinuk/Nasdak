package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.FileOwner;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
public class LedgerService {

    LedgerRepository ledgerRepository;

    @Autowired
    public LedgerService(LedgerRepository ledgerRepository){
        this.ledgerRepository = ledgerRepository;
    }

    public Ledger save(Ledger ledger) { return ledgerRepository.save(ledger);
    }

    public int ledgerUpdate(Ledger ledger) { return ledgerRepository.ledgerUpdate(ledger.getFileOwnerNo(), ledger.getLedgerType(), ledger.getPrice(), ledger.getComment(), ledger.getLocation(), ledger.getCategory().getCategoryNo());
    }

    public void ledgerDelete(Ledger ledger) { ledgerRepository.deleteById(ledger.getFileOwnerNo());
    }

    public List<String> getLedgerList(long userNo , int startPaging, int endPaging) {
        return ledgerRepository.getLedgerDateList(userNo, startPaging, endPaging);
    }

    public List<Ledger> getLedgerItem(String regDate, String regDate2, long userNo) {
        return ledgerRepository.getLedgerItem(regDate, regDate2, userNo);
    }

    public Ledger ledgerDetail(Ledger ledger) {
        return ledgerRepository.findById(ledger.getFileOwnerNo()).orElse(null);
    }

    public FileOwner findById(long fileOwnerNo) { return ledgerRepository.findById(fileOwnerNo).orElse(null);}

    public List<Ledger> findAllBylocation(User user) { return ledgerRepository.findAllByLocation(user.getUserNo());
    }

    public List<Ledger> ledgerAllList(User user) { return ledgerRepository.ledgerAllList(user.getUserNo());
    }

    public int TodayLedger(User user) { return ledgerRepository.TodayLedger(user.getUserNo());
    }

    public List<Ledger> getLedgerDayList(List<String> regDates, long userNo) {
        return ledgerRepository.getLedgerDayList(regDates, userNo);
    }


    public Collection<Object> findByUseDateBetween(LocalDate useDate, long userNo) {
        return ledgerRepository.findByUseDateBetween(useDate.atStartOfDay(), userNo);
    }

    public List<Ledger> getLedgerList(LocalDate startDate, LocalDate endDate, long userNo) {
        return ledgerRepository.getLedgerList(startDate, endDate , userNo);
    }

    public LocalDateTime getLedgerSearchDate(LocalDate startDate, long userNo) {
        return ledgerRepository.getLedgerSearchDate(startDate, userNo);
    }


    public List<Ledger> getLedgerPieList(LocalDate startDate, LocalDate endDate, long userNo) {
        return ledgerRepository.getLedgerPieList(startDate, endDate, userNo);
    }
}
