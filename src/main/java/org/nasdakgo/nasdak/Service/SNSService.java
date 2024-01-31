package org.nasdakgo.nasdak.Service;

import Utils.Delay;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.SNSRepository;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class SNSService {

    private final SNSRepository snsRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final SchedulerService schedulerService;

    private final Map<String, SNS> snsMap = new HashMap<>();

    public User connect(SNS sns){
        SNS find = this.findByUserAndSnsType(sns);
        if(find==null){
            snsRepository.save(sns);
        }
        return updateUserEmailAnaPhoneByConnectionSns(sns);
    }

    public boolean isDuplicatiedSns(long snsNo, long userNo){
        Optional<SNS> find = snsRepository.findById(snsNo);
        if(find.isEmpty()) return false;
        long dbUserNo = find.get().getUser().getUserNo();
        return dbUserNo!=userNo;
    }

    public User updateUserEmailAnaPhoneByConnectionSns(SNS sns){
        User user = userService.findByIdWithSNSList(sns.getUser().getUserNo());
        User emailUser = userService.findByEmail(sns.getEmail());
        User phoneUser = userService.findByPhone(sns.getPhone());
        if(emailUser==null&&user.getEmail()==null){
            userRepository.updateEmail(user.getUserNo(), sns.getEmail());
            user.setEmail(sns.getEmail());
        }
        if(phoneUser==null&&user.getPhone()==null){
            userRepository.updatePhone(user.getUserNo(), sns.getPhone());
            user.setPhone(sns.getPhone());
        }
        return user;
    }

    public void changeConnection(SNS sns){
        snsRepository.updateUser(sns.getSnsNo(), sns.getUser().getUserNo());
    }

    public SNS login(SNS sns){
        return snsRepository.login(sns.getSnsId()).orElse(null);
    }

    public SNS findById(SNS sns){
        return snsRepository.findById(sns.getSnsNo()).orElse(null);
    }

    public SNS signUp(SNS sns){
        User user = User.builder()
                .activeUser(true)
                .regDate(LocalDateTime.now())
                .sendKakaoTalk(false)
                .sendWebPush(false)
                .pushTime("23:00")
                .email(sns.getEmail())
                .phone(sns.getPhone())
                .build();
        if(userService.findByEmail(sns.getEmail())!=null)user.setEmail(null);
        if(userService.findByPhone(sns.getPhone())!=null)user.setPhone(null);
        userRepository.save(user);
        sns.setUser(user);
        snsRepository.save(sns);
        categoryService.saveDefaultCategory(user);
        return sns;
    }

    public List<User> findExistedUser(SNS sns){
        List<User> list = new ArrayList<>();
        User emailUser = userService.findByEmail(sns.getEmail());
        User phoneUser = userService.findByPhone(sns.getPhone());
        if(emailUser!=null) list.add(emailUser);
        if(emailUser==phoneUser) return list;
        if(phoneUser!=null) list.add(phoneUser);
        return list;
    }

    public List<SNS> findByUser(User user){
        return snsRepository.findByUser_UserNo(user.getUserNo());
    }

    public String cacheSns(SNS sns){
        String key = UUID.randomUUID().toString();
        snsMap.put(key, sns);
        resetCachedSnsTimer(key);
        return key;
    }

    public void deleteCachedSns(String key){
        snsMap.remove(key);
    }

    public SNS findCachedSns(String key){
        resetCachedSnsTimer(key);
        return snsMap.get(key);
    }

    public void resetCachedSnsTimer(String key){
        schedulerService.removeTimer(key);
        schedulerService.addTimer(key, ()->this.deleteCachedSns(key), Delay.ofMinutes(10));
    }

    public SNS findByUserAndSnsType(SNS sns){
        return snsRepository.findByUser_UserNoAndSnsType(sns.getUser().getUserNo(), sns.getSnsType());
    }

    public void updateRefreshToken(SNS sns){
        snsRepository.updateRefreshToken(sns.getSnsId(), sns.getRefreshToken());
    }

    public void disconnect(SNS sns){
        snsRepository.deleteSNSUser(sns.getUser().getUserNo(), sns.getSnsType());
    }

    public User findUserBySns(SNS sns){
        SNS find = snsRepository.findById(sns.getSnsNo()).orElse(null);
        if(find==null) return null;
        return find.getUser();
    }

}
