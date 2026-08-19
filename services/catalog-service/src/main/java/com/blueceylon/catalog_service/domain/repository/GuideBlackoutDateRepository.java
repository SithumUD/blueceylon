package com.blueceylon.catalog_service.domain.repository;

import com.blueceylon.catalog_service.domain.model.GuideBlackoutDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideBlackoutDateRepository extends JpaRepository<GuideBlackoutDate, String> {
    List<GuideBlackoutDate> findByGuideId(String guideId);
}
