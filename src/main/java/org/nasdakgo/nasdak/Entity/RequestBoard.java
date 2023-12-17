package org.nasdakgo.nasdak.Entity;

import Utils.DataUtils;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class RequestBoard extends FileOwner {

//    @Id @GeneratedValue
//    @Column(name = "request_no")
//    private long requestNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    private String Content;

    private String title;

    @Column(name = "regDate")
    private LocalDateTime regDate = DataUtils.parseDateTime(DataUtils.getCurrentDateTimeAsString());

    @OneToMany(mappedBy = "requestBoard")
    private List<RequestAnswer> requestAnswerList = new ArrayList<>();

}
