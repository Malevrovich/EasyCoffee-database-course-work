package org.example.repository;

import org.example.model.UsedIn;
import org.example.model.UsedInId;
import org.springframework.data.repository.CrudRepository;

public interface UsedInRepository extends CrudRepository<UsedIn, UsedInId> {
}
