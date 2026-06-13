package com.bryanpierre.portfolio.claims.repository;

import com.bryanpierre.portfolio.claims.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
