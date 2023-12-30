package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SNS {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "sns_no")
    private long snsNo;

    private String snsId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo")
    private User user;

    @Enumerated(EnumType.STRING)
    private SNSType snsType;

    private String refreshToken;
}
