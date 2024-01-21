package org.example.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "menuitems")
@Getter
@Setter
@NoArgsConstructor
public class MenuItem {
    @Id
    @SequenceGenerator(name="menuitems_item_id_seq", sequenceName = "menuitems_item_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "menuitems_item_id_seq")
    @Column(name="item_id", updatable = false)
    private int item_id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="price")
    private int price;

    public MenuItem(String name, String description, int price) {
        super();
        this.name = name;
        this.description = description;
        this.price = price;
    }
}
