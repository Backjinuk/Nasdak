package org.nasdakgo.nasdak.Entity;

import Utils.DataUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_no")
    private long userNo;

    @Column(name = "user_id")
    private String userId;

    private String password;

    private String email;

    private String phone;

    @Column(name = "reg_date")
    private LocalDateTime regDate = DataUtils.parseDateTime(DataUtils.getCurrentDateTimeAsString());

    private String profile;

    @Column(name = "send_kakao_talk")
    private boolean sendKakaoTalk;

    @Column(name = "send_web_push")
    private boolean sendWebPush;

    @Column(name = "active_user")
    private boolean activeUser;

    @OneToMany(mappedBy = "user")
    private List<Collection> collectionList = new ArrayList<>();

    @Column(name = "push_time")
    private String pushTime;

    @OneToMany(mappedBy = "user")
    private List<SNS> snsList = new ArrayList<>();

    public User(long userNo) {
        this.userNo = userNo;
    }


}
