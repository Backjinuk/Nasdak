package org.nasdakgo.nasdak.Dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nasdakgo.nasdak.Entity.SNSType;
import org.nasdakgo.nasdak.Entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class UserDto {

    private long userNo;

    private String userId;

    private String password;

    private String email;

    private String phone;

    private LocalDateTime regDate;

    private String profile;

    private boolean sendKakaoTalk;

    private boolean sendWebPush;

    private SNSType snsType;

    private String pushTime;

    private List<SNSDto> snsDtoList = new ArrayList<>();

    private List<CollectionDto> collectionDtoList = new ArrayList<>();

    public UserDto(User user){
        this.userNo = user.getUserNo();
        this.userId = user.getUserId();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.regDate = user.getRegDate();
        this.profile = user.getProfile();
        this.sendKakaoTalk = user.isSendKakaoTalk();
        this.sendWebPush = user.isSendWebPush();
        this.pushTime = user.getPushTime();
    }

    public User toUser(){
        User user = User.builder()
                .userNo(this.userNo)
                .userId(this.userId)
                .password(this.password)
                .email(this.email)
                .phone(this.phone)
                .regDate(this.regDate)
                .profile(this.profile)
                .sendKakaoTalk(this.sendKakaoTalk)
                .sendWebPush(this.sendWebPush)
                .pushTime(this.pushTime)
                .build();
        return user;
    }
}
