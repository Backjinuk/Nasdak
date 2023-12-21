package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.Category;
import org.nasdakgo.nasdak.Entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {

    @Modifying
    @Transactional
    @Query("update Ledger l set l.category = :after where l.category = :before")
    void moveCategoryToCategory(Category before, Category after);

    @Modifying
    @Transactional
    @Query("update Ledger l set l.category = :after where l.category in :before")
    void moveCategoryToCategory(List<Category> before, Category after);
}
