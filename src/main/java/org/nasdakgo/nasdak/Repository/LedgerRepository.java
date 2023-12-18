package org.nasdakgo.nasdak.Repository;

import jakarta.transaction.Transactional;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.LedgerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {


    @Transactional
    @Modifying
    @Query(value =
            "UPDATE Ledger l " +
            "SET l.comment= :comment ," +
                "l.ledger_type= :ledgerType ," +
                "l.location= :location ," +
                "l.price= :price ," +
                "l.category_no= :categoryNo " +
            "WHERE l.file_manager_no= :fileManagerNo"
            , nativeQuery = true
           )
    int ledgerUpdate(long fileManagerNo, LedgerType ledgerType, long price, String comment, String location, long categoryNo);

    @Query(value =
            "SELECT DISTINCT STR_TO_DATE(use_date, '%Y-%m-%d') AS REG_DATE " +
                    "FROM Ledger l " +
            "WHERE l.user_no= :userNo " +
            "ORDER BY STR_TO_DATE(use_date, '%Y-%m-%d') DESC ",
            nativeQuery = true)
    List<?> findAllUsers(long userNo);

    List<Ledger> findAllByOrderByUseDateAsc();

    @Query(value =
            "SELECT * " +
                    "FROM Ledger l " +
                    "WHERE l.user_no = :userNo " +
                    "AND l.use_date >= CAST(CONCAT(STR_TO_DATE(:regDate, '%Y-%m-%d'), ' 00:00:00') AS DATETIME) " +
                    "AND l.use_date <= CAST(CONCAT(STR_TO_DATE(:regDate, '%Y-%m-%d'), ' 23:59:59') AS DATETIME)"
            , nativeQuery = true)
    List<Ledger> ledgerItem(String regDate, long userNo);
}
