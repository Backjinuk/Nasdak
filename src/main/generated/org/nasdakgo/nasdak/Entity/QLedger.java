package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLedger is a Querydsl query type for Ledger
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLedger extends EntityPathBase<Ledger> {

    private static final long serialVersionUID = -2023552030L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLedger ledger = new QLedger("ledger");

    public final QFileOwner _super = new QFileOwner(this);

    public final QCategory category;

    public final StringPath comment = createString("comment");

    //inherited
    public final NumberPath<Long> fileOwnerNo = _super.fileOwnerNo;

    //inherited
    public final ListPath<Files, QFiles> filesList = _super.filesList;

    public final EnumPath<LedgerType> ledgerType = createEnum("ledgerType", LedgerType.class);

    public final QLocation location;

    public final NumberPath<Long> price = createNumber("price", Long.class);

    public final DateTimePath<java.time.LocalDateTime> useDate = createDateTime("useDate", java.time.LocalDateTime.class);

    public final QUser user;

    public QLedger(String variable) {
        this(Ledger.class, forVariable(variable), INITS);
    }

    public QLedger(Path<? extends Ledger> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLedger(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLedger(PathMetadata metadata, PathInits inits) {
        this(Ledger.class, metadata, inits);
    }

    public QLedger(Class<? extends Ledger> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new QCategory(forProperty("category"), inits.get("category")) : null;
        this.location = inits.isInitialized("location") ? new QLocation(forProperty("location")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

