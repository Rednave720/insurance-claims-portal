package com.bryanpierre.portfolio.claims.data;

import com.bryanpierre.portfolio.claims.entity.User;
import com.bryanpierre.portfolio.claims.enums.UserRole;
import com.bryanpierre.portfolio.claims.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataLoader {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User claimant = new User();
            claimant.setFirstName("Jordan");
            claimant.setLastName("Taylor");
            claimant.setEmail("jordan.taylor@example.com");
            claimant.setRole(UserRole.CLAIMANT);
            userRepository.save(claimant);

            User admin = new User();
            admin.setFirstName("Morgan");
            admin.setLastName("Reed");
            admin.setEmail("morgan.reed@example.com");
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
        };
    }
}
