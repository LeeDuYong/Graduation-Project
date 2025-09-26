package com.duyong.backend.Repository;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Entity.Favorite;
import com.duyong.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndClub(User user, Club club);
    Optional<Favorite> findByUserAndClub(User user, Club club);
}
