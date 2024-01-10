package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserId(String userId);

    @Query("select u from User u where u.userId = :userId and u.password = :password and activeUser = true")
    User findByUserIdAndPassword(@Param("userId") String userId,@Param("password") String password);

    @Query("select u from User u where u.email = :email and activeUser = true")
    User findByEmail(@Param("email") String email);

    @Query("select u from User u where u.phone = :phone and activeUser = true")
    User findByPhone(@Param("phone") String phone);

    @Query("select u from User u where u.userId = :userId and u.email = :email and activeUser = true")
    User findByUserIdAndEmail(@Param("userId") String userId,@Param("email")  String email);

    @Query("select u from User u where u.userId = :userId and u.phone = :phone and activeUser = true")
    User findByUserIdAndPhone(@Param("userId") String userId,@Param("phone")  String phone);

    @Modifying
    @Transactional
    @Query("update User u set u.password = :password where userNo = :userNo")
    void updatePassword(@Param("userNo") long userNo, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.email= :email , u.phone= :phone WHERE u.userNo= :userNo ")
    void updateAuth(@Param("userNo") long userNo, @Param("email") String email, @Param("phone") String phone);

    @Modifying
    @Transactional
    @Query("update User u set u.password = :password, u.email = :email," +
            " u.phone = :phone, u.sendKakaoTalk = :sendKakaoTalk, u.sendWebPush = :sendWebPush" +
            " where u.userNo = :userNo")
    void updateUserInfo(@Param("userNo") long userNo, @Param("password") String password,
                        @Param("email") String email, @Param("phone") String phone, @Param("sendKakaoTalk") boolean sendKakaoTalk,
                        @Param("sendWebPush") boolean sendWebPush);

    @Modifying
    @Transactional
    @Query("update User u set u.activeUser = false where u.userNo = :userNo")
    void deleteUser(@Param("userNo") long userNo);

    @Modifying
    @Transactional
    @Query("update User u set u.profile = :profile where u.userNo = :userNo")
    void updateProfile(@Param("userNo") Long userNo, @Param("profile") String profile);

    @Modifying
    @Transactional
    @Query("update User u set u.userId = :userId, u.password = :password where u.userNo = :userNo")
    void updateSNSUser(@Param("userNo") long userNo, @Param("userId") String userId, @Param("password") String password);

}
