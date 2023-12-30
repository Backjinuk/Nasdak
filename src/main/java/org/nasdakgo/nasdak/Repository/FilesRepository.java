package org.nasdakgo.nasdak.Repository;

import jakarta.transaction.Transactional;
import org.apache.ibatis.annotations.Param;
import org.nasdakgo.nasdak.Entity.FileOwner;
import org.nasdakgo.nasdak.Entity.Files;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilesRepository extends JpaRepository<Files, Long> {

    void deleteByFileOwner(FileOwner fileOwner);

    @Query("SELECT f FROM Files f WHERE f.fileOwner.fileOwnerNo = :fileOwnerNo")
    List<Files> findByFileOwner(@Param("fileOwnerNO") long fileOwnerNo);

    @Modifying
    @Transactional
    int deleteByFileNoIn(List<Long> checkedList);
}
