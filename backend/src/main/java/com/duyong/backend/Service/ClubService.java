package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Enums;
import com.duyong.backend.Repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;

    public Club createClub(Club club) {
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
                .orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }
}