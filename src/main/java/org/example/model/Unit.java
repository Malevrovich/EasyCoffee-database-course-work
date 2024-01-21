package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "units")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Unit {
    @Id
    @SequenceGenerator(name = "units_unit_id_seq", sequenceName = "units_unit_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "units_unit_id_seq")
    @Column(name = "unit_id", updatable = false)
    private int unit_id;

    @Column(name = "name")
    private String name;
}
