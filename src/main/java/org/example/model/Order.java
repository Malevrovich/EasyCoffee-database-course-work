package org.example.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @SequenceGenerator(name = "orders_order_id_seq", sequenceName = "orders_order_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_order_id_seq")
    @Column(name = "order_id", updatable = false)
    private int order_id;

    @Column(name = "time")
    private Timestamp timestamp;

    @Column(name = "status")
    private String status;
}
