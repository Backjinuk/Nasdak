package org.nasdakgo.nasdak.Service;

import lombok.RequiredArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNS;
import org.nasdakgo.nasdak.Entity.SNSType;
import org.nasdakgo.nasdak.Entity.User;
import org.nasdakgo.nasdak.Repository.SNSRepository;
import org.nasdakgo.nasdak.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SNSService {

    private final SNSRepository snsRepository;

    private final UserRepository userRepository;

    private final CategoryService categoryService;

    ////////////////////////////// 공통 //////////////////////////////
    public SNS snsLogin(SNS sns){
        // 로그인 수행
        SNS find = this.login(sns);

        // 계정이 없을 경우 신규 가입
        if(find==null){
            find = this.signUp(sns);
            categoryService.saveDefaultCategory(find.getUser());
        }

        // 카카오는 리프레시 토큰 갱신
        if(sns.getSnsType()== SNSType.KAKAO){
            find.setRefreshToken(sns.getRefreshToken());
            this.updateRefreshToken(find);
        }

        find.setAccessToken(sns.getAccessToken());
        return find;
    }

    public void connect(SNS sns){
        SNS find = this.findByUserAndSnsType(sns);
        if(find==null){
            snsRepository.save(sns);
        }else{
            find.setRefreshToken(sns.getRefreshToken());
            this.updateRefreshToken(find);
        }
    }

    public long connectCheck(SNS sns){
        Optional<SNS> find = snsRepository.findBySnsId(sns.getSnsId());
        if(find.isEmpty()) return 0;
        long dbUserNo = find.get().getUser().getUserNo();
        long newUserNo = sns.getUser().getUserNo();
        return dbUserNo==newUserNo?0:find.get().getSnsNo();
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
                .build();
        userRepository.save(user);
        sns.setUser(user);
        snsRepository.save(sns);
        return sns;
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
    ////////////////////////////// 공통 //////////////////////////////

}
