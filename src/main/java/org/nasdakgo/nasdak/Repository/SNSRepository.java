package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.SNSType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SNSRepository extends JpaRepository<SNS, Long> {

    @Query("select s, u from SNS s join s.user u where s.snsId = :snsId and u.activeUser = true")
    Optional<SNS> login(@Param("snsId") String snsId);

    List<SNS> findByUser_UserNo(long userNo);

    Optional<SNS> findBySnsId(String snsId);

    SNS findByUser_UserNoAndSnsType(long userNo, SNSType snsType);

    @Query("select s, u from SNS s join s.user u where s.refreshToken = :refreshToken and u.activeUser = true")
    Optional<SNS> findByRefreshToken(@Param("refreshToken") String refreshToken);

    @Modifying
    @Transactional
    @Query("update SNS s set s.refreshToken = :refreshToken where s.snsId = :snsId")
    void updateRefreshToken(@Param("snsId") String snsId, @Param("refreshToken") String refreshToken);

    @Modifying
    @Transactional
    @Query("delete from SNS s where s.user.userNo = :userNo and s.snsType = :snsType")
    void deleteSNSUser(@Param("userNo") long userNo, @Param("snsType") SNSType snsType);

    @Modifying
    @Transactional
    @Query("update SNS s set s.user.userNo = :userNo where s.snsNo = :snsNo")
    void updateUser(@Param("snsNo") long snsNo, @Param("userNo") long userNo);

}
