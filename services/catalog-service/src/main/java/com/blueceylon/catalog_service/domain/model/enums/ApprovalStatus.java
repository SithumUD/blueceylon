package com.blueceylon.catalog_service.domain.model.enums;

/**
 * Governs public visibility, not creation rights.
 * A Business (Hotel/TourAgency) or a TourGuideProfile can be created and can
 * immediately have child listings (Rooms, TourPackages) attached to it while
 * still PENDING_APPROVAL — those listings simply won't surface in Catalog
 * Service search results (which filter on parent.status = APPROVED) until
 * an Admin flips the parent to APPROVED. See dossier §3.5.
 */
public enum ApprovalStatus {
    DRAFT,
    PENDING_APPROVAL,
    APPROVED,
    REJECTED
}
