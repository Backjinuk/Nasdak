package org.nasdakgo.nasdak.Service;

import Utils.Delay;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Entity.RefreshTokenMap;
import org.nasdakgo.nasdak.Repository.RefreshTokenMapRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Component
public class RefreshTokenMapService {
    private final RefreshTokenMapRepository refreshTokenMapRepository;
    private final SchedulerService schedulerService;

    @PostConstruct
    public void initRefreshTokenService() {
        try {
            refreshTokenMapRepository.deleteExpiredToken(new Date().getTime());
        } catch (Exception e) {
            log.error("Failed to initialize RefreshTokenMapService", e);
        }
    }

    public void saveRefreshTokenMap(RefreshTokenMap refreshTokenMap){
        refreshTokenMapRepository.deleteByName(refreshTokenMap.getName());
        refreshTokenMapRepository.save(refreshTokenMap);
        setTimer(refreshTokenMap);
    }

    public RefreshTokenMap getRefreshTokenMap(String key){
        Optional<RefreshTokenMap> byKey = refreshTokenMapRepository.findByRefreshTokenMapKey(key);
        return byKey.orElse(null);
    }

    public void deleteRefreshTokenMap(String key){
        refreshTokenMapRepository.deleteToken(key);
    }

    private void setTimer(RefreshTokenMap refreshTokenMap){
        String key = refreshTokenMap.getRefreshTokenMapKey();
        schedulerService.addTimer(key, ()->deleteRefreshTokenMap(key),
                Delay.ofMillis(refreshTokenMap.getExpiredTime() - new Date().getTime()));
    }
}
