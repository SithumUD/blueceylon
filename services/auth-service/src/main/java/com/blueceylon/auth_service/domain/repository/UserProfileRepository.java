package com.blueceylon.auth_service.domain.repository;

import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByKeycloakSub(String keycloakSub);
    Optional<UserProfile> findByEmail(String email);
    Optional<UserProfile> findByVerificationToken(String verificationToken);

    List<UserProfile> findByRole(UserRole role);

    @Query("SELECT u FROM UserProfile u WHERE " +
           "(:query IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:role IS NULL OR u.role = :role)")
    List<UserProfile> searchUsers(@Param("query") String query, @Param("role") UserRole role);

    @Modifying
    @Query(value = "DELETE FROM user_profiles WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") String id);
}
