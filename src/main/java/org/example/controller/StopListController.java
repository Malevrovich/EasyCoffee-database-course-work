package org.example.controller;

import org.example.model.MenuItem;
import org.example.model.StopList;
import org.example.repository.MenuItemRepository;
import org.example.repository.StopListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/")
public class StopListController {
    @Autowired
    private StopListRepository stopListRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping("/stoplist")
    Stream<String> getStopListItems() {
        return menuItemRepository.findAllStopListItems().stream().map(MenuItem::getName);
    }

    @PostMapping("/stoplist/add")
    ResponseEntity<MenuItem> addToStopList(@RequestBody Map<String, Object> name) {
        var menuItem = menuItemRepository.findByName(name.get("name").toString());
        menuItem.ifPresent(item ->
                stopListRepository.save(new StopList(item.getItem_id(), name.get("reason").toString())));
        return ResponseEntity.of(menuItem);
    }

    @PostMapping("/stoplist/remove")
    ResponseEntity<MenuItem> removeFromStopList(@RequestBody Map<String, Object> name) {
        var menuItem = menuItemRepository.findByName(name.get("name").toString());
        menuItem.ifPresent(item -> stopListRepository.deleteById(item.getItem_id()));
        return ResponseEntity.of(menuItem);
    }
}
