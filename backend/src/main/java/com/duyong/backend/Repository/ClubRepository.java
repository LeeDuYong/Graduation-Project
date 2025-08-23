package com.duyong.backend.Repository;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Enums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByCategory(Enums.Category category);
}