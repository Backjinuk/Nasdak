package org.nasdakgo.nasdak.Repository;

import org.nasdakgo.nasdak.Entity.RefreshTokenMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RefreshTokenMapRepository extends JpaRepository<RefreshTokenMap, Long> {
    Optional<RefreshTokenMap> findByRefreshTokenMapKey(String key);

    @Modifying
    @Transactional
    @Query("delete from RefreshTokenMap r where r.expiredTime < :now")
    void deleteExpiredToken(@Param("now") Long now);

    @Modifying
    @Transactional
    @Query("delete from RefreshTokenMap r where r.refreshTokenMapKey = :key")
    void deleteToken(@Param("key") String key);

    @Modifying
    @Transactional
    @Query("delete from RefreshTokenMap r where r.name = :name")
    void deleteByName(@Param("name") String name);
}
