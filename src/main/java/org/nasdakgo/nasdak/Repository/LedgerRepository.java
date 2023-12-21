package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
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
                "l.x= :x ," +
                "l.y= :y ," +
                "l.price= :price ," +
                "l.category_no= :categoryNo " +
            "WHERE l.file_owner_no= :fileOwnerNo"
            , nativeQuery = true
           )
    int ledgerUpdate(long fileOwnerNo, LedgerType ledgerType, long price, String comment, float x, float y, long categoryNo);

    @Query(value =
            "SELECT DISTINCT DATE_FORMAT(use_date, '%Y-%m-%d') AS REG_DATE " +
                    "FROM Ledger l " +
            "WHERE l.user_no= :userNo " +
            "ORDER BY DATE_FORMAT(use_date, '%Y-%m-%d') DESC ",
            nativeQuery = true)
    List<?> findAllUsers(long userNo);

//    SELECT DISTINCT DATE_FORMAT(use_date, '%Y-%m-%d') AS REG_DATE
//    FROM Ledger l
//    WHERE l.user_no = 1
//    ORDER BY DATE_FORMAT(use_date, '%Y-%m-%d') DESC;

    @Query(value =
            "SELECT * " +
                    "FROM Ledger l " +
                    "WHERE l.user_no = :userNo " +
                    "AND l.use_date >= CAST(CONCAT(:regDate, ' 00:00:00') AS DATETIME) " +
                    "AND l.use_date <= CAST(CONCAT(:regDate, ' 23:59:59') AS DATETIME)"
            , nativeQuery = true)
    List<Ledger> ledgerItem(String regDate, long userNo);

    List<Ledger> findAllByOrderByUseDateAsc();
    @Modifying
    @Transactional
    @Query("update Ledger l set l.category = :after where l.category = :before")
    void moveCategoryToCategory(Category before, Category after);

    @Modifying
    @Transactional
    @Query("update Ledger l set l.category = :after where l.category in :before")
    void moveCategoryToCategory(List<Category> before, Category after);
}
