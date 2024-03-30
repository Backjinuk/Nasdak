package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRequestAnswer is a Querydsl query type for RequestAnswer
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRequestAnswer extends EntityPathBase<RequestAnswer> {

    private static final long serialVersionUID = -1391800684L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRequestAnswer requestAnswer = new QRequestAnswer("requestAnswer");

    public final NumberPath<Long> answerNo = createNumber("answerNo", Long.class);

    public final StringPath comment = createString("comment");

    public final DateTimePath<java.time.LocalDateTime> regDate = createDateTime("regDate", java.time.LocalDateTime.class);

    public final QRequestBoard requestBoard;

    public QRequestAnswer(String variable) {
        this(RequestAnswer.class, forVariable(variable), INITS);
    }

    public QRequestAnswer(Path<? extends RequestAnswer> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRequestAnswer(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRequestAnswer(PathMetadata metadata, PathInits inits) {
        this(RequestAnswer.class, metadata, inits);
    }

    public QRequestAnswer(Class<? extends RequestAnswer> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.requestBoard = inits.isInitialized("requestBoard") ? new QRequestBoard(forProperty("requestBoard"), inits.get("requestBoard")) : null;
    }

}

