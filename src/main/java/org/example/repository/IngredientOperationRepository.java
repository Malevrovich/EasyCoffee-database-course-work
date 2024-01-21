package org.example.repository;

import org.example.model.IngredientOperation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientOperationRepository extends CrudRepository<IngredientOperation, Integer> {
    List<IngredientOperation> findByIngredientId(int ingredient_id);
}
