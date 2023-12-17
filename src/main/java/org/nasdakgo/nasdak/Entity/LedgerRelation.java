package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LedgerRelation {

    @Id @GeneratedValue
    @Column(name = "Ledger_relation_no")
    private long ledgerRelationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ledger_no")
    private Ledger ledger;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_no")
    private Collection collection;
}
