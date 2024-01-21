package org.example.model;

import lombok.Data;
import org.springframework.data.util.Pair;

import java.util.List;

@Data
public class ItemWithIngredients {
    @Data
    public static class IdWithAmount {
        private int ingredient_id;
        private double amount;
    };

    private String name;
    private String description;
    private int price;
    private List<IdWithAmount> ingredients;
}
