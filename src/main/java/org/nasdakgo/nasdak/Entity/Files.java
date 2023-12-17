package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Files {

    @Id @GeneratedValue
    @Column(name = "file_no")
    private long fileNo;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_owner_no")
    private FileOwner fileOwner;
}
