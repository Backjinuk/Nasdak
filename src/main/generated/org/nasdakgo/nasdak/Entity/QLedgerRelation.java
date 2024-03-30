package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLedgerRelation is a Querydsl query type for LedgerRelation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLedgerRelation extends EntityPathBase<LedgerRelation> {

    private static final long serialVersionUID = 744515582L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLedgerRelation ledgerRelation = new QLedgerRelation("ledgerRelation");

    public final QCollection collection;

    public final QLedger ledger;

    public final NumberPath<Long> ledgerRelationNo = createNumber("ledgerRelationNo", Long.class);

    public QLedgerRelation(String variable) {
        this(LedgerRelation.class, forVariable(variable), INITS);
    }

    public QLedgerRelation(Path<? extends LedgerRelation> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLedgerRelation(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLedgerRelation(PathMetadata metadata, PathInits inits) {
        this(LedgerRelation.class, metadata, inits);
    }

    public QLedgerRelation(Class<? extends LedgerRelation> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.collection = inits.isInitialized("collection") ? new QCollection(forProperty("collection"), inits.get("collection")) : null;
        this.ledger = inits.isInitialized("ledger") ? new QLedger(forProperty("ledger"), inits.get("ledger")) : null;
    }

}

