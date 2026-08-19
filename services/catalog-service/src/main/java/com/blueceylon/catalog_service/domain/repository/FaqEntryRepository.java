package com.blueceylon.catalog_service.domain.repository;

import com.blueceylon.catalog_service.domain.model.FaqEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqEntryRepository extends JpaRepository<FaqEntry, String> {
    List<FaqEntry> findByBusinessId(String businessId);
}
