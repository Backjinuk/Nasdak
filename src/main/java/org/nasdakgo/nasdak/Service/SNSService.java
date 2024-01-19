package org.nasdakgo.nasdak.Service;

import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.SNSRepository;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SNSService {

    private final SNSRepository snsRepository;

    private final UserRepository userRepository;

    private final CategoryService categoryService;

    private final UserService userService;

    public User connect(SNS sns){
        SNS find = this.findByUserAndSnsType(sns);
        if(find==null){
            snsRepository.save(sns);
        }else{
            find.setRefreshToken(sns.getRefreshToken());
            this.updateRefreshToken(find);
        }
        return updateUserEmailAnaPhoneByConnectionSns(sns);
    }

    public long connectCheck(SNS sns){
        Optional<SNS> find = snsRepository.findBySnsId(sns.getSnsId());
        if(find.isEmpty()) return 0;
        long dbUserNo = find.get().getUser().getUserNo();
        long newUserNo = sns.getUser().getUserNo();
        return dbUserNo==newUserNo?0:find.get().getSnsNo();
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

    public SNS findByUserAndSnsType(SNS sns){
        return snsRepository.findByUser_UserNoAndSnsType(sns.getUser().getUserNo(), sns.getSnsType());
    }

    public void updateRefreshToken(SNS sns){
        snsRepository.updateRefreshToken(sns.getSnsNo(), sns.getRefreshToken());
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
