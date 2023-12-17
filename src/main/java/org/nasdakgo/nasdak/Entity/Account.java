package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {

    @Id @GeneratedValue
    @Column(name = "account_no")
    private long accountNo;

    private String bank;

    @Column(name =  "account_number")
    private String accountNumber;

    @Column(name = " account_password")
    private String accountPassword;

    @Column(name = "reg_date")
    private LocalDateTime regDate;
}
