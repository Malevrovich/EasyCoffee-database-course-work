package org.example.repository;

import org.example.model.MenuItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends CrudRepository<MenuItem, Integer> {
    Optional<MenuItem> findByName(String name);

    @Query(value = "SELECT MenuItems.* FROM MenuItems INNER JOIN StopList USING (item_id)", nativeQuery = true)
    List<MenuItem> findAllStopListItems();
}
