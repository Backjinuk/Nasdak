package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSNS is a Querydsl query type for SNS
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSNS extends EntityPathBase<SNS> {

    private static final long serialVersionUID = 276600223L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSNS sNS = new QSNS("sNS");

    public final StringPath refreshToken = createString("refreshToken");

    public final StringPath snsId = createString("snsId");

    public final NumberPath<Long> snsNo = createNumber("snsNo", Long.class);

    public final EnumPath<SNSType> snsType = createEnum("snsType", SNSType.class);

    public final QUser user;

    public QSNS(String variable) {
        this(SNS.class, forVariable(variable), INITS);
    }

    public QSNS(Path<? extends SNS> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSNS(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSNS(PathMetadata metadata, PathInits inits) {
        this(SNS.class, metadata, inits);
    }

    public QSNS(Class<? extends SNS> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

