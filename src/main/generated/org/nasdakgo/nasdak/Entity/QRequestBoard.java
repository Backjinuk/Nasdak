package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRequestBoard is a Querydsl query type for RequestBoard
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRequestBoard extends EntityPathBase<RequestBoard> {

    private static final long serialVersionUID = 2034249040L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRequestBoard requestBoard = new QRequestBoard("requestBoard");

    public final QFileOwner _super = new QFileOwner(this);

    public final StringPath Content = createString("Content");

    //inherited
    public final NumberPath<Long> fileOwnerNo = _super.fileOwnerNo;

    //inherited
    public final ListPath<Files, QFiles> filesList = _super.filesList;

    public final DateTimePath<java.time.LocalDateTime> regDate = createDateTime("regDate", java.time.LocalDateTime.class);

    public final ListPath<RequestAnswer, QRequestAnswer> requestAnswerList = this.<RequestAnswer, QRequestAnswer>createList("requestAnswerList", RequestAnswer.class, QRequestAnswer.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public final QUser user;

    public QRequestBoard(String variable) {
        this(RequestBoard.class, forVariable(variable), INITS);
    }

    public QRequestBoard(Path<? extends RequestBoard> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRequestBoard(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRequestBoard(PathMetadata metadata, PathInits inits) {
        this(RequestBoard.class, metadata, inits);
    }

    public QRequestBoard(Class<? extends RequestBoard> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

