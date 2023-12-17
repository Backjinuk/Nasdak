package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestAnswer {

    @Id @GeneratedValue
    @Column(name = "answer_no")
    private long answerNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_owner_no")
    private RequestBoard requestBoard;

    private String comment;

    @Column(name = "reg_date")
    private LocalDateTime regDate;
}
