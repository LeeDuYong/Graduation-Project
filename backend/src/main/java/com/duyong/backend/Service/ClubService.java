package com.duyong.backend.Service;

import com.duyong.backend.Entity.Club;
import com.duyong.backend.Repository.ClubRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    private final ClubRepository clubRepository;

    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    // Create
    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    // Read All
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // Read One
    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    // Update
    public Club updateClub(Long id, Club updatedClub) {
        return clubRepository.findById(id)
                .map(club -> {
                    club.setName(updatedClub.getName());
                    club.setDescription(updatedClub.getDescription());
                    club.setCategory(updatedClub.getCategory());
                    club.setRecruiting(updatedClub.isRecruiting());
                    return clubRepository.save(club);
                })
                .orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    // Delete
    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }
}