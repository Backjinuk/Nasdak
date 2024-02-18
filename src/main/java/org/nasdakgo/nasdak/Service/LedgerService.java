package org.nasdakgo.nasdak.Service;

import org.nasdakgo.nasdak.Entity.FileOwner;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public List<Ledger> findAll() {
        return ledgerRepository.findAllByOrderByUseDateAsc();
    }

    public List<?> findAllByUsers(long userNo) {
        return ledgerRepository.findAllUsers(userNo);
    }

    public List<Ledger> findAllByUsers2(long userNo, int startPaging, int endPaging) {
        int pageNumber = (endPaging != 0) ? startPaging / (endPaging - startPaging) : 0;
        int pageSize = endPaging - startPaging;

        Pageable pageable = PageRequest.of(startPaging, endPaging);

        return ledgerRepository.findAllUsers2(userNo, pageable);
    }



    public List<Ledger> ledgerItem(String regDate, long userNo) {
        return ledgerRepository.ledgerItem(regDate, userNo);
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


    public Collection<Object> findByUseDateBetween(LocalDate useDate, long userNo) {
        return ledgerRepository.findByUseDateBetween(useDate.atStartOfDay(), userNo);
    }
}
