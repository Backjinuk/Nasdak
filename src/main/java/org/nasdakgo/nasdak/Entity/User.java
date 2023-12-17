package org.nasdakgo.nasdak.Entity;

import Utils.DataUtils;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
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

    @OneToMany(mappedBy = "user")
    private List<Collection> collectionList = new ArrayList<>();
}
