package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {



    @Query(value = "SELECT * " +
            "FROM Category c " +
            "WHERE c.user_no= :userNo ",
            nativeQuery = true)
    List<Category> categoryUserList(long userNo);
}
