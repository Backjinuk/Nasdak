package org.nasdakgo.nasdak.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "board_category")
public class FileOwner {

    @Id @GeneratedValue
    @Column(name="file_owner_no")
    private long fileOwnerNo;

    @OneToMany(mappedBy = "fileOwner", cascade = CascadeType.ALL)
    private List<Files> filesList;

}
