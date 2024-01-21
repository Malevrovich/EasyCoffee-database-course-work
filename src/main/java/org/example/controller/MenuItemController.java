package org.example.controller;

import org.example.model.ItemWithIngredients;
import org.example.model.MenuItem;
import org.example.model.UsedIn;
import org.example.repository.MenuItemRepository;
import org.example.repository.UsedInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/")
public class MenuItemController {
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private UsedInRepository usedInRepository;

    @GetMapping("/menuitems")
    public Iterable<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @PostMapping("/menuitems")
    public MenuItem createMenuItem(@RequestBody ItemWithIngredients itemWithIngredients) {
        MenuItem menuItem = new MenuItem(
                itemWithIngredients.getName(),
                itemWithIngredients.getDescription(),
                itemWithIngredients.getPrice()
        );
        menuItemRepository.save(menuItem);
        for (ItemWithIngredients.IdWithAmount idWithAmount: itemWithIngredients.getIngredients()) {
            usedInRepository.save(new UsedIn(
                    menuItem.getItem_id(),
                    idWithAmount.getIngredient_id(),
                    idWithAmount.getAmount()
            ));
        }
        return menuItem;
    }
}
