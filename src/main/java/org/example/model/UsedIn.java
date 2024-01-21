package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="usedin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(UsedInId.class)
public class UsedIn {
    @Id
    @Column(name="item_id")
    private int item_id;

    @Id
    @Column(name="ingredient_id")
    private int ingredient_id;

    @Column(name="amount")
    private double amount;
}

