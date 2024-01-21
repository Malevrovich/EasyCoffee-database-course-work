package org.example.repository;

import org.example.model.Reason;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReasonsRepository extends CrudRepository<Reason, Integer> {
    Reason findByReason(String reason);
}
