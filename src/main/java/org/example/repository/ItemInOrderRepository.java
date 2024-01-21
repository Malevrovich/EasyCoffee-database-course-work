package org.example.repository;

import org.example.model.ItemInOrder;
import org.example.model.ItemInOrderId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemInOrderRepository extends CrudRepository<ItemInOrder, ItemInOrderId> {
    Iterable<ItemInOrder> findByOrderId(int order_id);
}
