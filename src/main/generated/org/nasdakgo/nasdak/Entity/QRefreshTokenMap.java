package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRefreshTokenMap is a Querydsl query type for RefreshTokenMap
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRefreshTokenMap extends EntityPathBase<RefreshTokenMap> {

    private static final long serialVersionUID = 664914501L;

    public static final QRefreshTokenMap refreshTokenMap = new QRefreshTokenMap("refreshTokenMap");

    public final StringPath authorities = createString("authorities");

    public final NumberPath<Long> expiredTime = createNumber("expiredTime", Long.class);

    public final StringPath name = createString("name");

    public final StringPath refreshTokenMapKey = createString("refreshTokenMapKey");

    public final NumberPath<Long> refreshTokenMapNo = createNumber("refreshTokenMapNo", Long.class);

    public QRefreshTokenMap(String variable) {
        super(RefreshTokenMap.class, forVariable(variable));
    }

    public QRefreshTokenMap(Path<? extends RefreshTokenMap> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRefreshTokenMap(PathMetadata metadata) {
        super(RefreshTokenMap.class, metadata);
    }

}

