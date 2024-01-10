package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SNS {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "sns_no")
    private long snsNo;

    private String snsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo")
    private User user;

    @Enumerated(EnumType.STRING)
    private SNSType snsType;

    private String refreshToken;

    @Transient
    private String accessToken;
}
