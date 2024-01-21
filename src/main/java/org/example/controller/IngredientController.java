package org.example.controller;

import lombok.Data;
import org.example.model.*;
import org.example.repository.IngredientOperationRepository;
import org.example.repository.IngredientRepository;
import org.example.repository.ReasonsRepository;
import org.example.repository.UnitsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/")
public class IngredientController {
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private IngredientOperationRepository ingredientOperationRepository;
    @Autowired
    private ReasonsRepository reasonsRepository;
    @Autowired
    private UnitsRepository unitsRepository;

    @GetMapping("/ingredients")
    public Iterable<Ingredient> getIngredients() {
        return ingredientRepository.findAll();
    }

    @Data
    public static class Operation implements Serializable {
        private int ingredient_id;
        private double increase;
        private int reason_id;
    }

    @PostMapping("/ingredients/operation")
    public ResponseEntity<IngredientOperation> addOperations(@RequestBody Operation op) {
        var ingredientOp = new IngredientOperation();

        ingredientOp.setIngredientId(op.getIngredient_id());
        ingredientOp.setIncrease(op.getIncrease());
        ingredientOp.setReason_id(op.getReason_id());

        ingredientOperationRepository.save(ingredientOp);

        return ResponseEntity.ok(ingredientOp);
    }


    @GetMapping("/ingredients/operation")
    public List<IngredientOperation> getIngredientOperations(@RequestParam int ingredient_id) {
        Reason sql_update_id = reasonsRepository.findByReason("sql_update");
        return ingredientOperationRepository.findByIngredientId(ingredient_id).stream()
                .filter(ingredientOperation ->
                        (ingredientOperation.getReason_id() != sql_update_id.getReason_id())
                ).toList();
    }

    @Data
    public static class NewIngredient {
        private String name;
        private double init_amount;
        private String units;
    }

    @PostMapping("/ingredients/add")
    public ResponseEntity<Ingredient> addIngredient(@RequestBody NewIngredient newIngredient) {
        var ingredient = new Ingredient();
        ingredient.setInit_amount(newIngredient.getInit_amount());
        ingredient.setAmount(newIngredient.getInit_amount());
        ingredient.setName(newIngredient.getName());
        ingredient.setUnits(newIngredient.getUnits());
        ingredientRepository.save(ingredient);

        return ResponseEntity.ok(ingredient);
    }

    @GetMapping("/ingredients/units")
    public Iterable<Unit> getUnits() {
        return unitsRepository.findAll();
    }

    @GetMapping("/ingredients/reasons")
    public Iterable<Reason> getReasons() {
        return reasonsRepository.findAll();
    }

}
