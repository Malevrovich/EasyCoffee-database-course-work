package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.sql.Date;

@Entity
@Table(name="activeorders")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ActiveOrder {
    @Id
    @SequenceGenerator(name="orders_order_id_seq", sequenceName = "orders_order_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_order_id_seq")
    @Column(name="order_id", updatable = false)
    private int order_id;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="time")
    private Timestamp timestamp;

    @Column(name="status")
    private String status;

    @Column(name="items")
    private List<String> items;
}
