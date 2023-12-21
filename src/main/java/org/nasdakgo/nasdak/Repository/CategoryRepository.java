package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Modifying
    @Transactional
    @Query("update Category c set c.content = :content where c.categoryNo = :categoryNo")
    void updateContent(@Param("categoryNo") long categoryNo, @Param("content") String content);

    List<Category> findAllByUser_UserNo(@Param("userNo") long userNo);

    @Query("select c from Category c where c.user.userNo = :userNo and c.content = '기타'")
    Category findDefaultCategory(@Param("userNo") long userNo);

    @Query("select count(c) from Category c where c in :categoryList and c.delYn = 'N'")
    int countDelN(@Param("categoryList") List<Category> categoryList);

}
