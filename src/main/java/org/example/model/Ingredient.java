package org.example.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
public class Ingredient {
    @Id
    @SequenceGenerator(name = "ingredients_ingredient_id_seq", sequenceName = "ingredients_ingredient_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ingredients_ingredient_id_seq")
    @Column(name = "ingredient_id", updatable = false)
    private int ingredient_id;

    @Column(name = "name")
    private String name;

    @Column(name = "amount")
    private double amount;

    @Column(name = "init_amount")
    private double init_amount;

    @Column(name = "units")
    private String units;
}
