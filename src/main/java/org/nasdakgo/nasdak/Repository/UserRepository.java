package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserId(String userId);

    User findByUserIdAndPassword(String userId, String password);

    User findByEmail(String email);

    User findByPhone(String phone);

    User findByUserIdAndEmail(String userId, String email);

    User findByUserIdAndPhone(String userId, String phone);

    @Modifying
    @Transactional
    @Query("update User u set u.password = :password where userNo = :userNo")
    void updatePassword(@Param("userNo") long userNo, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.email= :email , u.phone= :phone WHERE u.userNo= :userNo ")
    void updateAuth(@Param("userNo") long userNo, @Param("email") String email, @Param("phone") String phone);

}
