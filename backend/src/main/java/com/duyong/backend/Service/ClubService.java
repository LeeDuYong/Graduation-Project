package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Entity.Post;
import com.duyong.backend.Entity.User;
import com.duyong.backend.Enums;
import com.duyong.backend.Repository.ClubRepository;
import com.duyong.backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    @Transactional
    public Club createClub(Club club, String username) {
        User manager = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        club.setManager(manager);
        Post initialPost = Post.builder()
                .title(club.getName() + "입니다.")
                .content("우리 동아리에 오신 것을 환영합니다! 홍보글을 수정해주세요.")
                .build();
        club.setPost(initialPost);
        return clubRepository.save(club);
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    public List<Club> getClubsByCategory(Enums.Category category) {
        return clubRepository.findByCategory(category);
    }

    public Club updateClub(Long id, Club Club) {
        return clubRepository.findById(id)
                .map(club -> {
                    club.setName(Club.getName());
                    club.setDescription(Club.getDescription());
                    club.setCategory(Club.getCategory());
                    club.setRecruiting(Club.isRecruiting());
                    return clubRepository.save(club);
                })
                .orElseThrow(() -> new RuntimeException("해당 동아리를 찾을 수 없습니다: " + id));
    }
    public List<Club> findMyClubs(String username) {
        User manager = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return clubRepository.findByManager(manager);
    }
    @Transactional
    public Club updatePost(Long clubId, Post postDetails, String username) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("해당 동아리를 찾을 수 없습니다."));

        if (!club.getManager().getUsername().equals(username)) {
            throw new SecurityException("게시물을 수정할 권한이 없습니다.");
        }

        Post post = club.getPost();
        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());

        return club;
    }
    @Transactional
    public Club updateRecruitingStatus(Long clubId, boolean recruiting, String username) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("해당 동아리를 찾을 수 없습니다."));
        if (club.getManager() == null || !club.getManager().getUsername().equals(username)) {
            throw new SecurityException("상태를 수정할 권한이 없습니다.");
        }
        club.setRecruiting(recruiting);
        return club;
    }

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    @Transactional
    public List<Club> searchClubs(String categoryStr, Boolean recruiting, String keyword) {
        List<Specification<Club>> specs = new ArrayList<>();

        if (categoryStr != null && !categoryStr.isBlank()) {
            try {
                Enums.Category category = Enums.Category.valueOf(categoryStr.toUpperCase());
                specs.add(ClubSpecification.hasCategory(category));
            } catch (IllegalArgumentException e) {
            }
        }

        if (recruiting != null) {
            specs.add(ClubSpecification.isRecruiting(recruiting));
        }

        if (keyword != null && !keyword.isBlank()) {
            specs.add(ClubSpecification.hasKeyword(keyword));
        }

        return clubRepository.findAll(Specification.allOf(specs));
    }
}