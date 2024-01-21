package org.example.repository;

import org.example.model.ActiveOrder;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public interface ActiveOrdersRepository extends CrudRepository<ActiveOrder, Integer> {
    @Query(value = "SELECT close_order(:order_id, :status); ", nativeQuery = true)
    void closeOrder(@Param("order_id") int order_id, @Param("status") String status);
}
