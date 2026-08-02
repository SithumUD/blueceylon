package com.blueceylon.catalog_service.domain.model.enums;

/**
 * Deliberately a closed enum rather than a free-text `city` column.
 * Location is the single most-filtered field on the Catalog search hot path
 * (composite index: city, available_from, available_to, nightly_price — see
 * dossier §4.3/§18), so keeping it a controlled vocabulary avoids the
 * classic "Colombo" vs "colombo" vs "Colombo " data-quality problem that
 * would otherwise quietly break that index's selectivity.
 */
public enum SriLankanCity {
    COLOMBO,
    NEGOMBO,
    KANDY,
    GALLE,
    MIRISSA,
    UNAWATUNA,
    ELLA,
    NUWARA_ELIYA,
    SIGIRIYA,
    DAMBULLA,
    ANURADHAPURA,
    POLONNARUWA,
    TRINCOMALEE,
    ARUGAM_BAY,
    BENTOTA,
    HIKKADUWA,
    JAFFNA,
    YALA,
    UDAWALAWE,
    HAPUTALE,
    KALPITIYA,
    WELIGAMA,
    TANGALLE,
    BATTICALOA,
    RATNAPURA,
    KITULGALA
}
