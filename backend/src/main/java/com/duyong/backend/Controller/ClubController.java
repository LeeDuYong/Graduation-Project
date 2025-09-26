package com.duyong.backend.Controller;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Entity.Post;
import com.duyong.backend.Enums;
import com.duyong.backend.Service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(clubs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable Long id) {
        return clubService.getClubById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Club> createClub(@RequestBody Map<String, Object> payload, Authentication authentication) {
        Club club = new Club();
        club.setName((String) payload.get("name"));
        club.setDescription((String) payload.get("description"));
        club.setCategory(Enums.Category.valueOf((String) payload.get("category")));
        club.setRecruiting((Boolean) payload.get("recruiting"));


        Club createdClub = clubService.createClub(club, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClub);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club Club) {
        return ResponseEntity.ok(clubService.updateClub(id, Club));
    }

    @PutMapping("/{clubId}/post")
    public ResponseEntity<Club> updatePost(@PathVariable Long clubId, @RequestBody Post postDetails, Authentication authentication) {
        try {
            Club updatedClub = clubService.updatePost(clubId, postDetails, authentication.getName());
            return ResponseEntity.ok(updatedClub);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{clubId}/recruiting")
    public ResponseEntity<Club> updateRecruitingStatus(
            @PathVariable Long clubId,
            @RequestBody Map<String, Boolean> payload,
            Authentication authentication
    ) {
        Boolean isRecruiting = payload.get("recruiting");
        if (isRecruiting == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Club updatedClub = clubService.updateRecruitingStatus(clubId, isRecruiting, authentication.getName());
            return ResponseEntity.ok(updatedClub);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/manage/my-clubs")
    public ResponseEntity<List<Club>> getMyClubs(Authentication authentication) {
        List<Club> myClubs = clubService.findMyClubs(authentication.getName());
        return ResponseEntity.ok(myClubs);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Club>> getClubsByCategory(@PathVariable Enums.Category category) {
        return ResponseEntity.ok(clubService.getClubsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Club>> searchClubs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean recruiting,
            @RequestParam(required = false) String keyword
    ) {
        List<Club> searchResult = clubService.searchClubs(category, recruiting, keyword);
        return ResponseEntity.ok(searchResult);
    }
}
