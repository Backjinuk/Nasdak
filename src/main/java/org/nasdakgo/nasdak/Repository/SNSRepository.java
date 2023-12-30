package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.SNS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SNSRepository extends JpaRepository<SNS, Long> {

    @Query("select s, u from SNS s join s.user u where s.snsId = :snsId and u.activeUser = true")
    Optional<SNS> login(@Param("snsId") String snsId);

    SNS findByUser_UserNo(long userNo);

    @Query("select s, u from SNS s join s.user u where s.refreshToken = :refreshToken and u.activeUser = true")
    Optional<SNS> findByRefreshToken(@Param("refreshToken") String refreshToken);

}
