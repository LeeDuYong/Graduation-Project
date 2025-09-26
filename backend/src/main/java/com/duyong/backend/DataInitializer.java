package com.duyong.backend;


import com.duyong.backend.Entity.User;
import com.duyong.backend.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("adminuser")) {
            User adminUser = User.builder()
                    .username("adminuser")
                    .password(passwordEncoder.encode("password"))
                    .role(Enums.Role.ROLE_ADMIN) // 역할을 ADMIN으로 설정!
                    .build();
            userRepository.save(adminUser);
        }
    }
}