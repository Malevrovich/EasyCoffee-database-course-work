package org.example.repository;

import org.example.model.StopList;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StopListRepository extends CrudRepository<StopList, Integer> {
}
