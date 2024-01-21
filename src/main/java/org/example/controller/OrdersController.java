package org.example.controller;

import lombok.*;
import org.example.model.ActiveOrder;
import org.example.model.MenuItem;
import org.example.model.Order;
import org.example.repository.ActiveOrdersRepository;
import org.example.repository.ItemInOrderRepository;
import org.example.repository.MenuItemRepository;
import org.example.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/")
public class OrdersController {

    @Autowired
    private ActiveOrdersRepository activeOrdersRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ItemInOrderRepository itemInOrderRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping("orders/active")
    Iterable<ActiveOrder> getActiveOrders() {
        return activeOrdersRepository.findAll();
    }

    @PostMapping("orders/create")
    ResponseEntity<ActiveOrder> createOrder(@RequestBody List<String> items_name) {
        var activeOrder = new ActiveOrder();
        activeOrder.setItems(items_name);
        activeOrder.setStatus("active");
        activeOrdersRepository.save(activeOrder);
        return ResponseEntity.ok(activeOrder);
    }

    @PostMapping("orders/cancel")
    ResponseEntity<ActiveOrder> cancelOrder(@RequestBody ActiveOrder req) {
        activeOrdersRepository.closeOrder(req.getOrder_id(), "cancelled");
        return ResponseEntity.ok(req);
    }

    @PostMapping("orders/close")
    ResponseEntity<ActiveOrder> closeOrder(@RequestBody ActiveOrder req) {
        activeOrdersRepository.closeOrder(req.getOrder_id(), "done");
        return ResponseEntity.ok(req);
    }

    @Data
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderWithItems implements Serializable {
        private Order order;

        @Data
        @Getter
        @Setter
        @AllArgsConstructor
        @NoArgsConstructor
        public static class ItemWithAmount implements Serializable {
            private MenuItem item;
            private double amount;
        }

        List<ItemWithAmount> items;
    }

    @GetMapping("orders/history")
    List<OrderWithItems> getHistory() {
        Iterable<Order> orders = orderRepository.findAll();

        List<OrderWithItems> result = new ArrayList<>();
        orders.forEach(order -> {
            var itemsInOrder = itemInOrderRepository.findByOrderId(order.getOrder_id());

            List<OrderWithItems.ItemWithAmount> items = new ArrayList<>();
            itemsInOrder.forEach(itemInOrder -> {
                var item = menuItemRepository.findById(itemInOrder.getItem_id());
                items.add(new OrderWithItems.ItemWithAmount(item.get(), itemInOrder.getAmount()));
            });

            result.add(new OrderWithItems(order, items));
        });

        return result;
    }
}
