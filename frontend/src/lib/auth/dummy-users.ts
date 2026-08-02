// src/lib/auth/dummy-users.ts
// Development test accounts. Remove when connecting to real backend.
// Password for all accounts: "password"

import type { User } from "./types";

export interface DummyUser extends User {
  _password: string; // only used locally for validation
}

export const DUMMY_USERS: DummyUser[] = [
  {
    id: "usr_traveler_001",
    keycloakSub: "kc-sub-traveler-001",
    email: "traveler@test.com",
    _password: "password",
    firstName: "Amal",
    lastName: "Perera",
    phoneNumber: "+94 77 111 0001",
    profileImageUrl: null,
    role: "TRAVELER",
    businessType: null,
  },
  {
    id: "usr_hotel_002",
    keycloakSub: "kc-sub-hotel-002",
    email: "hotel@test.com",
    _password: "password",
    firstName: "Nimal",
    lastName: "Silva",
    phoneNumber: "+94 77 111 0002",
    profileImageUrl: null,
    role: "BUSINESS_OWNER",
    businessType: "HOTEL",
  },
  {
    id: "usr_agency_003",
    keycloakSub: "kc-sub-agency-003",
    email: "agency@test.com",
    _password: "password",
    firstName: "Kasun",
    lastName: "Fernando",
    phoneNumber: "+94 77 111 0003",
    profileImageUrl: null,
    role: "BUSINESS_OWNER",
    businessType: "TOUR_AGENCY",
  },
  {
    id: "usr_guide_004",
    keycloakSub: "kc-sub-guide-004",
    email: "guide@test.com",
    _password: "password",
    firstName: "Chaminda",
    lastName: "Ranatunga",
    phoneNumber: "+94 77 111 0004",
    profileImageUrl: null,
    role: "TOUR_GUIDE",
    businessType: "TOUR_GUIDE",
  },
  {
    id: "usr_admin_005",
    keycloakSub: "kc-sub-admin-005",
    email: "admin@test.com",
    _password: "password",
    firstName: "Super",
    lastName: "Admin",
    phoneNumber: null,
    profileImageUrl: null,
    role: "ADMIN",
    businessType: null,
  },
];
