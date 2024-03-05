package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -15231868L;

    public static final QUser user = new QUser("user");

    public final BooleanPath activeUser = createBoolean("activeUser");

    public final ListPath<Collection, QCollection> collectionList = this.<Collection, QCollection>createList("collectionList", Collection.class, QCollection.class, PathInits.DIRECT2);

    public final StringPath email = createString("email");

    public final StringPath password = createString("password");

    public final StringPath phone = createString("phone");

    public final StringPath profile = createString("profile");

    public final StringPath pushTime = createString("pushTime");

    public final DateTimePath<java.time.LocalDateTime> regDate = createDateTime("regDate", java.time.LocalDateTime.class);

    public final BooleanPath sendKakaoTalk = createBoolean("sendKakaoTalk");

    public final BooleanPath sendWebPush = createBoolean("sendWebPush");

    public final ListPath<SNS, QSNS> snsList = this.<SNS, QSNS>createList("snsList", SNS.class, QSNS.class, PathInits.DIRECT2);

    public final StringPath userId = createString("userId");

    public final NumberPath<Long> userNo = createNumber("userNo", Long.class);

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

