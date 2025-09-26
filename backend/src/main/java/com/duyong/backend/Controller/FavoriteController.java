package com.duyong.backend.Controller;

import com.duyong.backend.Entity.User;
import com.duyong.backend.Service.FavoriteService;
import com.duyong.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository; // User 정보 조회용

    @PostMapping("/{clubId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long clubId, Authentication authentication) {
        String username = authentication.getName();
        favoriteService.addFavorite(clubId, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{clubId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long clubId, Authentication authentication) {
        String username = authentication.getName();
        favoriteService.removeFavorite(clubId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Long>> getMyFavoriteClubIds(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<Long> favoriteClubIds = user.getFavorites().stream()
                .map(favorite -> favorite.getClub().getId())
                .toList();
        return ResponseEntity.ok(favoriteClubIds);
    }
}
