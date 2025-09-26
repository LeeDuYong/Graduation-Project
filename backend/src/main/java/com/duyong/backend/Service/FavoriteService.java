package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Entity.Favorite;
import com.duyong.backend.Entity.User;
import com.duyong.backend.Repository.ClubRepository;
import com.duyong.backend.Repository.FavoriteRepository;
import com.duyong.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    public void addFavorite(Long clubId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 찾지 못함"));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("동아리 찾지 못함"));

        if (favoriteRepository.existsByUserAndClub(user, club)) {
            return;
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .club(club)
                .build();
        favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long clubId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 찾지 못함"));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("동아리 찾지 못함"));

        Favorite favorite = favoriteRepository.findByUserAndClub(user, club)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기 찾지 못함"));

        favoriteRepository.delete(favorite);
    }
}
