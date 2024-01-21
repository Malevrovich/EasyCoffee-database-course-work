package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "ingredientoperations")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class IngredientOperation {
    @Id
    @SequenceGenerator(name = "ingredientoperations_op_id_seq", sequenceName = "ingredientoperations_op_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ingredientoperations_op_id_seq")
    @Column(name = "op_id", updatable = false)
    private int op_id;

    @Column(name = "ingredient_id")
    private int ingredientId;

    @Column(name = "increase")
    private double increase;

    @Column(name = "reason_id")
    private int reason_id;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time")
    private Timestamp timestamp;
}
