package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class Collection {

    @Id
    @GeneratedValue
    @JoinColumn(name = "collection_no")
    private long collectionNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no") // User 클래스의 userNo 필드와 연결
    private User user;

    private String title;

    @Column(name = "reg_date")
    private LocalDateTime regDate;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL)
    private List<LedgerRelation> ledgerRelationList;

}
