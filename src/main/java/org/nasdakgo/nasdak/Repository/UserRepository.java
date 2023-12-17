package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {



    @Modifying
    @Transactional
    @Query(value =
            "UPDATE User u " +
                    "   SET u.email= :email ," +
                    "u.phone= :phone " +
                    "WHERE u.user_no= :userNo ",
            nativeQuery = true)
    void userUpdate(long userNo, String email, String phone);


    @Query(value =
            "SELECT * " +
                    "FROM User u " +
                    "WHERE u.user_id= :userId " +
                    "AND u.password= :password"
            , nativeQuery = true)
    User userLogin(String userId, String password);

    @Query(value =
            "SELECT * FROM " +
                    "User u " +
                    "WHERE u.user_id = :userId",
            nativeQuery = true)
    User findByUserId(String userId);
}
