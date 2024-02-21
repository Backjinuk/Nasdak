package org.nasdakgo.nasdak.Repository;

import org.apache.ibatis.annotations.Param;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.nasdakgo.nasdak.Entity.LedgerType;
import org.nasdakgo.nasdak.Entity.Location;
import org.nasdakgo.nasdak.Repository.QueryDsl.LedgerRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long>, LedgerRepositoryCustom {


    @Transactional
    @Modifying
    @Query(
            "UPDATE Ledger l " +
                    "SET l.comment= :comment ," +
                    "l.ledgerType= :ledgerType ," +
                    "l.location= :location ," +
                    "l.price= :price ," +
                    "l.category.categoryNo= :categoryNo " +
                    "WHERE l.fileOwnerNo= :fileOwnerNo"
    )
    int ledgerUpdate(
            @Param("fileOwnerNo") long fileOwnerNo,
            @Param("ledgerType") LedgerType ledgerType,
            @Param("price") long price,
            @Param("comment") String comment,
            @Param("location") Location location,
            @Param("categoryNo") long categoryNo
    );

    @Query(
            value = "SELECT DISTINCT DATE_FORMAT(l.use_date, '%Y-%m-%d') AS REG_DATE " +
                    "FROM Ledger l " +
                    "WHERE l.user_no= :userNo " +
                    "ORDER BY DATE_FORMAT(l.use_date, '%Y-%m-%d') DESC " +
                    "LIMIT :startPaging, :endPaging",
            nativeQuery = true
    )
    List<String> findAllUsers(@Param("userNo") long userNo, @Param("startPaging") int startPaging, @Param("endPaging") int endPaging);


    @Query(
            value = "SELECT l.* FROM ledger l " +
                    "WHERE l.user_no = :userNo " +
                    "ORDER BY DATE_FORMAT(l.use_date, '%Y-%m-%d') DESC " +
                    "LIMIT :startPaging, :endPaging",
            nativeQuery = true)
    List<Ledger> findAllUsers2(@Param("userNo") long userNo, @Param("startPaging") int startPaging, @Param("endPaging") int endPaging);


    @Query(
            "SELECT l " +
                    "FROM Ledger l " +
                    "WHERE l.user.userNo = :userNo " +
                    "AND l.useDate >= CAST(CONCAT(:regDate, ' 00:00:00') AS TIMESTAMP) " +
                    "AND l.useDate <= CAST(CONCAT(:regDate2, ' 23:59:59') AS TIMESTAMP)"
    )
    List<Ledger> ledgerItem(@Param("refDate") String regDate, @Param("refDate2") String regDate2, @Param("userNo") long userNo);


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

    @Query("SELECT l from Ledger l where l.user.userNo = :userNo")
    List<Ledger> ledgerAllList(long userNo);

    @Query(value = "SELECT SUM(l.price) AS price FROM Ledger l " +
            "WHERE l.user.userNo = :userNo " +
            "AND l.useDate >= CAST(CONCAT(DATE_FORMAT(NOW(), '%Y-%m-%d'), ' 00:00:00') AS TIMESTAMP) " +
            "AND l.useDate <= CAST(CONCAT(DATE_FORMAT(NOW(), '%Y-%m-%d'), ' 23:59:59') AS TIMESTAMP)" )
    int  TodayLedger(@Param("userNo") long userNo);


    @Query("SELECT l FROM Ledger l " +
            "WHERE  l.user.userNo= :userNo " +
            "AND l.useDate >= CAST(CONCAT(DATE_FORMAT(:useDate , '%Y-%m-%d'), ' 00:00:00') AS TIMESTAMP) " +
            "AND l.useDate <= CAST(CONCAT(DATE_FORMAT(:useDate , '%Y-%m-%d'), ' 23:59:59') AS TIMESTAMP)" )
    Collection<Object> findByUseDateBetween(@Param("useDate") LocalDateTime useDate, @Param("userNo") long userNo);

}
