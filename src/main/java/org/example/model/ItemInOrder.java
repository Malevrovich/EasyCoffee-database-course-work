package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "iteminorder")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ItemInOrderId.class)
public class ItemInOrder {
    @Id
    @Column(name = "order_id")
    private int orderId;

    @Id
    @Column(name = "item_id")
    private int item_id;

    @Column(name = "amount")
    private int amount;
}