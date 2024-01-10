package org.nasdakgo.nasdak.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ledger extends FileOwner {

//    @Id @GeneratedValue
//    @Column(name = "ggb_no")
//    private long ggbNo;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_no")
    private Category category;

    private long price;

    @Enumerated(EnumType.STRING)
    private LedgerType ledgerType;

    @Embedded
    private Location location = new Location(0,0, "`");

/*
 @OneToMany(mappedBy = "fileOwner")
    private List<Files> filesList = new ArrayList<>();
 */

    private String comment;

    @Column(name = "use_date")
    private LocalDateTime useDate;

}
