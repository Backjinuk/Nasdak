package org.nasdakgo.nasdak.Entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QFileOwner is a Querydsl query type for FileOwner
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFileOwner extends EntityPathBase<FileOwner> {

    private static final long serialVersionUID = -408683138L;

    public static final QFileOwner fileOwner = new QFileOwner("fileOwner");

    public final NumberPath<Long> fileOwnerNo = createNumber("fileOwnerNo", Long.class);

    public final ListPath<Files, QFiles> filesList = this.<Files, QFiles>createList("filesList", Files.class, QFiles.class, PathInits.DIRECT2);

    public QFileOwner(String variable) {
        super(FileOwner.class, forVariable(variable));
    }

    public QFileOwner(Path<? extends FileOwner> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFileOwner(PathMetadata metadata) {
        super(FileOwner.class, metadata);
    }

}

