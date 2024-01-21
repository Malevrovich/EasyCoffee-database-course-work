package org.example.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "reasons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reason {
    @Id
    @SequenceGenerator(name = "reasons_reason_id_seq", sequenceName = "reasons_reason_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reasons_reason_id_seq")
    @Column(name = "reason_id", updatable = false)
    private int reason_id;

    @Column(name = "reason")
    private String reason;

    @Column(name = "description")
    private String description;
}
