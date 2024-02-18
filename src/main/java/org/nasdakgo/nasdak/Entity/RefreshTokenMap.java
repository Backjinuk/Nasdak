package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenMap {

    @Id @GeneratedValue @Column(name="refresh_token_map_no")
    private Long refreshTokenMapNo;
    private String refreshTokenMapKey;
    private String name;
    private String authorities;
    @Column(name="expired_time")
    private Long expiredTime;
}
