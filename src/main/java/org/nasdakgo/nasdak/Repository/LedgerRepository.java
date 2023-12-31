package org.nasdakgo.nasdak.Repository;

import org.apache.ibatis.annotations.Param;
import org.nasdakgo.nasdak.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {


    @Transactional
    @Modifying
    @Query(
            "UPDATE Ledger l " +
                    "SET l.comment= :comment ," +
                    "l.ledgerType= :ledgerType ," +
                    "l.location.x= :x ," +
                    "l.location.y= :y ," +
                    "l.price= :price ," +
                    "l.category.categoryNo= :categoryNo " +
                    "WHERE l.fileOwnerNo= :fileOwnerNo"
    )
    int ledgerUpdate(
            @Param("fileOwnerNo") long fileOwnerNo,
            @Param("ledgerType") LedgerType ledgerType,
            @Param("price") long price,
            @Param("comment") String comment,
            @Param("x") float x,
            @Param("y") float y,
            @Param("categoryNo") long categoryNo
    );

    @Query(
            "SELECT DISTINCT DATE_FORMAT(l.useDate, '%Y-%m-%d') AS REG_DATE " +
                    "FROM Ledger l " +
                    "WHERE l.user.userNo= :userNo " +
                    "ORDER BY DATE_FORMAT(l.useDate, '%Y-%m-%d') DESC "
    )
    List<?> findAllUsers(@Param("userNo") long userNo);


//    SELECT DISTINCT DATE_FORMAT(use_date, '%Y-%m-%d') AS REG_DATE
//    FROM Ledger l
//    WHERE l.user_no = 1
//    ORDER BY DATE_FORMAT(use_date, '%Y-%m-%d') DESC;

    @Query(
            "SELECT l " +
            "FROM Ledger l " +
            "WHERE l.user.userNo = :userNo " +
            "AND l.useDate >= CAST(CONCAT(:regDate, ' 00:00:00') AS TIMESTAMP) " +
            "AND l.useDate <= CAST(CONCAT(:regDate, ' 23:59:59') AS TIMESTAMP)"
            )
    List<Ledger> ledgerItem(@Param("refDate") String regDate, @Param("userNo") long userNo);

    List<Ledger> findAllByOrderByUseDateAsc();

    @Modifying
    @Transactional
    @Query("update Ledger l set l.category.categoryNo = :after where l.category.categoryNo = :before")
    void moveCategoryToCategory(long before, long after);

    @Modifying
    @Transactional
    @Query("update Ledger l set l.category.categoryNo = :after where l.category.categoryNo in :before")
    void moveCategoryToCategory(List<Long> before, long after);

    @Query("SELECT l FROM Ledger  l WHERE l.user.userNo = :userNo AND l.location.x != 0 AND l.location.y != 0 AND l.location.address IS NOT NULL")
    List<Ledger> findAllByLocation(@Param("userNo") long userNo);
}
