package org.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stoplist")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StopList {
    @Id
    @Column(name = "item_id")
    private int item_id;

    @Column(name = "reason")
    private String reason;
}
