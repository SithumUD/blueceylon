package com.blueceylon.catalog_service.infrastructure.seed;

import com.blueceylon.catalog_service.domain.model.*;
import com.blueceylon.catalog_service.domain.model.enums.*;
import com.blueceylon.catalog_service.domain.model.enums.Currency;
import com.blueceylon.catalog_service.domain.model.embeddable.*;
import com.blueceylon.catalog_service.domain.repository.*;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Component
public class CatalogDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CatalogDataSeeder.class);

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private TourGuideProfileRepository guideRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private DayOutPackageRepository dayOutPackageRepository;

    @Autowired
    private NightOutPackageRepository nightOutPackageRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FaqEntryRepository faqEntryRepository;

    @Override
    @Transactional
    public void run(String... args) {
        long hotelCount = businessRepository.findAll().stream().filter(b -> b instanceof Hotel).count();
        if (hotelCount >= 50) {
            log.info("Catalog database already contains {} hotels. Skipping seed.", hotelCount);
            return;
        }

        log.info("Starting comprehensive Catalog Database seeding (50 Hotels, 50 Agencies, 50 Guides, Rooms, Tours, Reviews)...");

        // 1. Seed Amenities
        Map<String, Amenity> amenities = seedAmenities();

        // 2. Seed 50 Hotels with Rooms, Hotel Tours, Day/Night Out Packages, Reviews, and FAQs
        List<Hotel> hotels = seedHotels(amenities);

        // 3. Seed 50 Tour Agencies with Multi-day Tour Packages, Reviews, and FAQs
        List<TourAgency> agencies = seedTourAgencies(amenities);

        // 4. Seed 50 Tour Guides with Private Tour Packages, Languages, and Reviews
        List<TourGuideProfile> guides = seedTourGuides(amenities);

        log.info("Catalog Database seeding completed successfully! [Hotels: {}, Agencies: {}, Guides: {}]",
                hotels.size(), agencies.size(), guides.size());
    }

    private Map<String, Amenity> seedAmenities() {
        Map<String, Amenity> map = new HashMap<>();
        String[][] list = {
                {"FREE_WIFI", "Free High-Speed Wi-Fi", "wifi", "PROPERTY"},
                {"SWIMMING_POOL", "Infinity Swimming Pool", "waves", "PROPERTY"},
                {"AIR_CONDITIONING", "Climate Control A/C", "wind", "ROOM"},
                {"SPA_WELLNESS", "Ayurvedic Spa & Wellness", "sparkles", "PROPERTY"},
                {"OCEAN_VIEW", "Panoramic Ocean View", "sun", "ROOM"},
                {"MOUNTAIN_VIEW", "Misty Mountain View", "mountain", "ROOM"},
                {"PRIVATE_BALCONY", "Private Balcony / Terrace", "door-open", "ROOM"},
                {"BREAKFAST_INCLUDED", "Artisan Ceylon Breakfast", "coffee", "PROPERTY"},
                {"ROOM_SERVICE_247", "24/7 Butler & Room Service", "bell", "PROPERTY"},
                {"AIRPORT_SHUTTLE", "Luxury Airport Chauffeur", "car", "PROPERTY"},
                {"SAFARI_VEHICLE", "4x4 Open-Top Safari Jeep", "truck", "TOUR"},
                {"CERTIFIED_GUIDE", "English / Multilingual Guide", "user-check", "TOUR"},
                {"SOLAR_POWERED", "100% Solar Powered Eco-Grid", "sun", "PROPERTY"},
                {"PETS_WELCOME", "Pet Friendly Facilities", "dog", "PROPERTY"},
                {"FITNESS_CENTER", "Modern Fitness & Gym", "dumbbell", "PROPERTY"},
                {"MINI_BAR", "Fully Stocked Gourmet Mini-Bar", "wine", "ROOM"},
                {"TEA_COFFEE_MAKER", "Organic Ceylon Tea & Espresso Bar", "cup-soda", "ROOM"},
                {"HOT_WATER", "Rain Shower & Hot Water", "droplet", "ROOM"},
                {"JACUZZI", "Heated Private Jacuzzi", "bath", "ROOM"},
                {"BEACH_FRONT", "Direct Private Beach Access", "umbrella", "PROPERTY"},
                {"SNORKELING_GEAR", "Snorkeling & Scuba Gear Included", "anchor", "TOUR"},
                {"BINOCULARS", "High-Definition Safari Binoculars", "eye", "TOUR"},
                {"CAMPING_GEAR", "Waterproof Trekking & Camping Gear", "tent", "TOUR"},
                {"MEALS_INCLUDED", "All Meals & Refreshments Included", "utensils", "TOUR"},
        };

        for (String[] a : list) {
            Amenity amenity = amenityRepository.findByCode(a[0]).orElseGet(() -> {
                Amenity am = new Amenity();
                am.setCode(a[0]);
                am.setLabel(a[1]);
                am.setIconKey(a[2]);
                am.setScope(AmenityScope.valueOf(a[3]));
                return amenityRepository.save(am);
            });
            map.put(a[0], amenity);
        }
        return map;
    }

    private List<Hotel> seedHotels(Map<String, Amenity> amenities) {
        SriLankanCity[] cities = SriLankanCity.values();
        PropertyType[] propTypes = PropertyType.values();
        String[] hotelNames = {
                "Amangalla Heritage Villa", "Heritance Kandalama Forest Resort", "Jetwing Lighthouse Oceanfront",
                "Ceylon Tea Trails Castlereagh", "Wild Coast Tented Safari Lodge", "Santani Holistic Wellness Resort",
                "The Fortress Resort & Spa", "Anantara Peace Haven Tangalle", "Cinnamon Grand Luxury Suites",
                "Shangri-La Horizon Hotel", "Cape Weligama Cliffside Villas", "Jetwing Vil Uyana Eco Retreat",
                "98 Acres Mountain Resort & Spa", "Grand Hotel Heritage Nuwara Eliya", "Aliya Resort & Cultural Sanctuary",
                "Uga Ulagalla Heritage Estate", "Cinnamon Lodge Nature Reserve", "The Kingsbury Ocean View",
                "Jetwing Blue Lagoon Resort", "Trinco Blu Coastal Sanctuary", "Jungle Beach Luxury Wilderness",
                "Cinnamon Wild Leopard Haven", "Earl's Regency Mountain Palace", "Mandira Dickoya Tea Estate Bungalow",
                "Heritage Galle Fort Manor", "Ella Jungle Eco Haven", "Heritance Ahungalla Beach Oasis",
                "Uga Chena Huts Luxury Safari", "Galle Face Colonial Legend Hotel", "Water Garden Sigiriya Water Villas",
                "Jetwing St. Andrew's Tudor Manor", "Thaproban Pavilion Waves Resort", "Amaya Hills Sanctuary Kandy",
                "Cinnamon Citadel Riverside Retreat", "Club Dolphin Golden Coast Resort", "Palm Paradise Eco Cabanas Mirissa",
                "The Secret Ella Mountain Chalets", "Leopard Trails Tented Camps Yala", "Jetwing Beach Lagoon & Spa",
                "Palmstone Private Rainforest Retreat", "The Elephant Corridor Wilderness Suite", "Uga Jungle Beach & Diving Resort",
                "Mirissa Hills Cinnamon Plantation Villa", "Heritance Tea Factory Cloud Hotel", "Paradise Road The Villa Bentota",
                "The Forest Rock Garden Hermitage", "Tamarind Tree Garden Resort Negombo", "Dutch House Heritage Villa Galle",
                "Living Heritage Koslanda Waterfall Estate", "Cinnamon Red Sky Urban Hotel"
        };

        String[] hotelPhotos = {
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
        };

        List<Hotel> list = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            SriLankanCity city = cities[i % cities.length];
            Region region = getRegionForCity(city);
            PropertyType pType = propTypes[i % propTypes.length];
            String name = hotelNames[i];
            String ownerId = "hotel_owner_" + (i + 1);

            Hotel h = new Hotel();
            h.setName(name);
            h.setTagline("Exclusive " + pType.name().replace("_", " ") + " in " + city.name().replace("_", " "));
            h.setDescription("Experience world-renowned Sri Lankan luxury at " + name + ". Surrounded by pristine landscapes in " + city.name().replace("_", " ") + ", featuring award-winning architecture, fine Ceylon dining, and personalized hospitality.");
            h.setContactEmail("reservations@" + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com");
            h.setContactPhone("+94 " + (710000000 + i * 12345));
            h.setWhatsappNumber("+94 " + (770000000 + i * 54321));
            h.setWebsite("https://www." + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com");
            h.setOwnerId(ownerId);
            h.setStatus(ApprovalStatus.APPROVED);
            h.setVerificationStatus(VerificationStatus.VERIFIED);
            h.setCity(city);
            h.setRegion(region);
            h.setLatitude(6.0 + (i % 10) * 0.3);
            h.setLongitude(80.0 + (i % 10) * 0.2);
            h.setAddressLine("No. " + (10 + i) + ", Beach & Sanctuary Road, " + city.name().replace("_", " "));
            h.setCoverImageUrl(hotelPhotos[i % hotelPhotos.length]);
            h.setGalleryImageUrls(Arrays.asList(hotelPhotos[(i + 1) % hotelPhotos.length], hotelPhotos[(i + 2) % hotelPhotos.length], hotelPhotos[(i + 3) % hotelPhotos.length]));
            h.setAverageRating(4.5 + (i % 5) * 0.1);
            h.setReviewCount(15 + i * 4);
            h.setResponseTimeHours(1.2);
            h.setResponseRate(98.5);
            h.setYearsInBusiness(5 + (i % 15));
            h.setCancellationPolicy(i % 2 == 0 ? CancellationPolicy.FLEXIBLE : CancellationPolicy.MODERATE);
            h.setPaymentMethods(Arrays.asList(PaymentMethod.ONLINE_PAYMENT, PaymentMethod.PAY_AT_PROPERTY, PaymentMethod.BANK_TRANSFER));
            h.setSustainabilityBadges(Arrays.asList(SustainabilityBadge.ECO_CERTIFIED, SustainabilityBadge.LOCALLY_OWNED, SustainabilityBadge.PLASTIC_FREE));
            h.setStarRating(3 + (i % 3));
            h.setTotalBranches(1 + (i % 3));
            h.setPropertyType(pType);
            h.setCheckInTime(LocalTime.of(14, 0));
            h.setCheckOutTime(LocalTime.of(11, 0));
            h.setPetPolicy(i % 3 == 0 ? PetPolicy.ALLOWED : PetPolicy.NOT_ALLOWED);
            h.setTotalRooms(10 + i * 2);
            h.setOffersDayOutPackages(true);
            h.setOffersNightOutPackages(true);
            h.setOffersHourlyBooking(false);
            h.setSltdaLicenseNumber("SLTDA/HOTEL/2026/" + (1000 + i));

            // Facilities
            h.setAmenities(Arrays.asList(
                    amenities.get("FREE_WIFI"), amenities.get("SWIMMING_POOL"),
                    amenities.get("AIR_CONDITIONING"), amenities.get("SPA_WELLNESS"),
                    amenities.get("BREAKFAST_INCLUDED"), amenities.get("ROOM_SERVICE_247")
            ));

            Hotel savedHotel = businessRepository.save(h);

            // Seed 3-4 Rooms per hotel
            seedRoomsForHotel(savedHotel, amenities, hotelPhotos, i);

            // Seed Hotel Tours
            seedToursForHotel(savedHotel, amenities, hotelPhotos, i);

            // Seed Day/Night Out Packages
            seedExperiencePackagesForHotel(savedHotel, amenities, hotelPhotos, i);

            // Seed Reviews
            seedReviewsForEntity(savedHotel.getId(), ReviewEntityType.HOTEL, savedHotel.getName());

            // Seed FAQs
            seedFaqsForBusiness(savedHotel);

            list.add(savedHotel);
        }
        return list;
    }

    private void seedRoomsForHotel(Hotel hotel, Map<String, Amenity> amenities, String[] photos, int hotelIndex) {
        RoomType[] types = {RoomType.DELUXE, RoomType.SUITE, RoomType.SUPERIOR, RoomType.VILLA};
        String[] roomTitles = {"Deluxe King Room", "Presidential Ocean Suite", "Superior Garden Chalet", "Private Pool Villa"};
        Double[] prices = {85.0 + (hotelIndex % 5) * 15, 175.0 + (hotelIndex % 5) * 30, 110.0 + (hotelIndex % 5) * 20, 290.0 + (hotelIndex % 5) * 50};
        String[] bedConfigs = {"1 Extra-Large King Bed", "1 King Bed + 1 Sofa Bed", "2 Queen Beds", "1 Master King + 2 Twin Beds"};

        for (int r = 0; r < types.length; r++) {
            Room room = new Room();
            room.setHotel(hotel);
            room.setRoomNumber(String.valueOf(101 + r * 10));
            room.setDisplayName(hotel.getName() + " - " + roomTitles[r]);
            room.setRoomType(types[r]);
            room.setCity(hotel.getCity());
            room.setPricePerNight(prices[r]);
            room.setCurrency(Currency.USD);
            room.setCapacity(2 + (r % 3));
            room.setBedCount(1 + (r % 2));
            room.setSizeSquareMeters(38.0 + r * 16.0);
            room.setAvailableFrom(LocalDate.now());
            room.setAvailableTo(LocalDate.now().plusMonths(12));
            room.setTotalUnits(4 + r * 2);
            room.setViewType(r % 2 == 0 ? ViewType.OCEAN_VIEW : ViewType.MOUNTAIN_VIEW);
            room.setBedConfiguration(bedConfigs[r]);
            room.setSmokingAllowed(false);
            room.setIsHourlyBookable(false);
            room.setImageUrls(Arrays.asList(
                    photos[(hotelIndex + r) % photos.length],
                    photos[(hotelIndex + r + 1) % photos.length]
            ));
            room.setAmenities(Arrays.asList(
                    amenities.get("FREE_WIFI"), amenities.get("AIR_CONDITIONING"),
                    amenities.get("PRIVATE_BALCONY"), amenities.get("MINI_BAR"),
                    amenities.get("TEA_COFFEE_MAKER"), amenities.get("HOT_WATER")
            ));
            roomRepository.save(room);
        }
    }

    private void seedToursForHotel(Hotel hotel, Map<String, Amenity> amenities, String[] photos, int hotelIndex) {
        String[] tourTitles = {
                hotel.getCity().name().replace("_", " ") + " Sunrise Safari & Heritage Expedition",
                "Private Scenic Highland & Waterfall Discovery Tour"
        };
        TourCategory[] categories = {TourCategory.WILDLIFE, TourCategory.ADVENTURE};

        for (int t = 0; t < 2; t++) {
            TourPackage tp = new TourPackage();
            tp.setTitle(hotel.getName() + " - " + tourTitles[t]);
            tp.setDescription("Exclusive curated island expedition departing directly from " + hotel.getName() + ". Enjoy private chauffeur transport, licensed naturalist guidance, scenic tea valleys, wildlife viewing, and gourmet picnic meals.");
            tp.setPrice(95.0 + t * 65.0 + (hotelIndex % 4) * 10);
            tp.setCurrency(Currency.USD);
            tp.setDurationDays(t == 0 ? 1 : 2);
            tp.setCategory(categories[t]);
            tp.setStartingCity(hotel.getCity());
            tp.setOwnerId(hotel.getOwnerId());
            tp.setOwnerType(OwnerType.HOTEL);
            tp.setMinGroupSize(1);
            tp.setMaxGroupSize(8);
            tp.setImageUrls(Arrays.asList(
                    photos[(hotelIndex + t) % photos.length],
                    photos[(hotelIndex + t + 2) % photos.length]
            ));
            tp.setDifficultyLevel(t == 0 ? DifficultyLevel.EASY : DifficultyLevel.MODERATE);
            tp.setPhysicalRequirements("Light walking shoes, camera, sunglasses, and comfortable outdoor attire.");
            tp.setTransportModeIncluded(VehicleType.SUV);
            tp.setMealsIncluded(MealPlan.FULL_BOARD);
            tp.setAccommodationIncluded(t > 0);
            tp.setIsPrivateTour(true);
            tp.setInclusions(Arrays.asList(
                    amenities.get("SAFARI_VEHICLE"), amenities.get("CERTIFIED_GUIDE"),
                    amenities.get("BINOCULARS"), amenities.get("MEALS_INCLUDED")
            ));

            // Group pricing tiers
            GroupPricingTier tier1 = new GroupPricingTier();
            tier1.setTourPackage(tp);
            tier1.setMinTravelers(1);
            tier1.setMaxTravelers(2);
            tier1.setPricePerPerson(tp.getPrice());

            GroupPricingTier tier2 = new GroupPricingTier();
            tier2.setTourPackage(tp);
            tier2.setMinTravelers(3);
            tier2.setMaxTravelers(6);
            tier2.setPricePerPerson(Math.round(tp.getPrice() * 0.85 * 100.0) / 100.0);

            GroupPricingTier tier3 = new GroupPricingTier();
            tier3.setTourPackage(tp);
            tier3.setMinTravelers(7);
            tier3.setMaxTravelers(null);
            tier3.setPricePerPerson(Math.round(tp.getPrice() * 0.75 * 100.0) / 100.0);

            tp.setPricingTiers(Arrays.asList(tier1, tier2, tier3));

            // Translations
            TourPackageTranslation trSi = new TourPackageTranslation();
            trSi.setTourPackage(tp);
            trSi.setLocale(com.blueceylon.catalog_service.domain.model.enums.Locale.SI);
            trSi.setTitle(hotel.getName() + " - සංචාරක අත්දැකීම (" + hotel.getCity().name() + ")");
            trSi.setDescription("ශ්‍රී ලංකාවේ සුන්දරත්වය අත්විඳින්න. ප්‍රවාහනය සහ මඟපෙන්වීම ඇතුළත් වේ.");

            TourPackageTranslation trTa = new TourPackageTranslation();
            trTa.setTourPackage(tp);
            trTa.setLocale(com.blueceylon.catalog_service.domain.model.enums.Locale.TA);
            trTa.setTitle(hotel.getName() + " - சுற்றுப்பயணம் (" + hotel.getCity().name() + ")");
            trTa.setDescription("இலங்கையின் இயற்கை அழகை அனுபவியுங்கள். போக்குவரத்து மற்றும் வழிகாட்டி சேர்க்கப்பட்டுள்ளது.");

            tp.setTranslations(Arrays.asList(trSi, trTa));

            // Itinerary
            List<ItineraryDay> days = new ArrayList<>();
            for (int d = 1; d <= tp.getDurationDays(); d++) {
                ItineraryDay iday = new ItineraryDay();
                iday.setTourPackage(tp);
                iday.setDayNumber(d);
                iday.setTitle("Day " + d + ": Exploring " + hotel.getCity().name().replace("_", " "));
                iday.setDescription("Morning departure with private guide, nature trails, temple visits, and scenic sunset viewpoint.");
                iday.setOvernightLocation(hotel.getCity().name().replace("_", " "));
                iday.setMeals(Arrays.asList(MealPlan.FULL_BOARD));
                days.add(iday);
            }
            tp.setItineraryDays(days);
            tourPackageRepository.save(tp);
        }
    }

    private void seedExperiencePackagesForHotel(Hotel hotel, Map<String, Amenity> amenities, String[] photos, int hotelIndex) {
        // Day Out
        DayOutPackage dayPkg = new DayOutPackage();
        dayPkg.setHotel(hotel);
        dayPkg.setTitle(hotel.getName() + " - Signature Luxury Day Pass");
        dayPkg.setDescription("Spend a relaxing day enjoying the infinity pool, 3-course chef lunch, wellness garden access, and afternoon Ceylon tea.");
        dayPkg.setPrice(35.0 + (hotelIndex % 3) * 10);
        dayPkg.setCurrency(Currency.USD);
        dayPkg.setPricingUnit(PricingUnit.PER_PERSON);
        dayPkg.setStartTime(LocalTime.of(9, 0));
        dayPkg.setEndTime(LocalTime.of(18, 0));
        dayPkg.setMaxOccupancy(25);
        dayPkg.setDailyLimit(15);
        dayPkg.setImageUrls(Arrays.asList(photos[hotelIndex % photos.length]));
        dayPkg.setInclusions(Arrays.asList(amenities.get("SWIMMING_POOL"), amenities.get("FREE_WIFI"), amenities.get("BREAKFAST_INCLUDED")));
        dayOutPackageRepository.save(dayPkg);

        // Night Out
        NightOutPackage nightPkg = new NightOutPackage();
        nightPkg.setHotel(hotel);
        nightPkg.setTitle(hotel.getName() + " - Moonlight Seafood BBQ & Bonfire Evening");
        nightPkg.setDescription("Evening dining package under the stars with live acoustic music, premium seafood BBQ buffet, and cocktail lounge access.");
        nightPkg.setPrice(45.0 + (hotelIndex % 3) * 10);
        nightPkg.setCurrency(Currency.USD);
        nightPkg.setPricingUnit(PricingUnit.PER_PERSON);
        nightPkg.setStartTime(LocalTime.of(18, 30));
        nightPkg.setEndTime(LocalTime.of(23, 0));
        nightPkg.setIncludesOvernightStay(false);
        nightPkg.setMaxOccupancy(30);
        nightPkg.setDailyLimit(20);
        nightPkg.setImageUrls(Arrays.asList(photos[(hotelIndex + 1) % photos.length]));
        nightPkg.setInclusions(Arrays.asList(amenities.get("FREE_WIFI"), amenities.get("SPA_WELLNESS")));
        nightOutPackageRepository.save(nightPkg);
    }

    private List<TourAgency> seedTourAgencies(Map<String, Amenity> amenities) {
        SriLankanCity[] cities = SriLankanCity.values();
        String[] agencyNames = {
                "Lanka Heritage Trails & Travels", "Serendib Wildlife Safaris Co.", "Ceylon Express Tour Operators",
                "Southern Coast Marine & Whale Expeditions", "Knuckles Range Mountain Trekking", "Sigiriya Cultural Heritage Travels",
                "Ella Peak & Tea Valley Explorers", "Galle Colonial Fort Walking Tours", "Royal Ceylon Luxury Chauffeurs",
                "Wild Ceylon Leopard Safari Specialists", "Hill Country Scenic Train & Tea Circuit", "Trincomalee Marine & Coral Reef Travels",
                "Ancient Kingdoms Archaeological Tours", "Negombo Lagoon & Water Sports Travels", "Pure Ceylon Eco-Tours & Safaris",
                "Ceylon Overland 4x4 Adventures", "Blue Ocean Deep Sea Fishing & Whale Tours", "Lanka Birdwatching & Rainforest Expeditions",
                "Pearl of the Indian Ocean Travel Hub", "Mahaweli River & Cultural Circuit Tours", "Adam's Peak Pilgrimage & Trekking Co.",
                "Yala Wilderness Camp & Jeep Safaris", "Mirissa Surfing & Coastal Road Trips", "Nuwara Eliya Colonial Tea Trails",
                "Kandy Sacred Temple & Botanical Travels", "Wilpattu Leopard Safari Company", "Bentota Watersports & River Safaris",
                "Hikkaduwa Coral Reef & Turtle Travels", "Jaffna Northern Peninsula Expeditions", "Sinharaja Virgin Rainforest Trails",
                "Minneriya Elephant Gathering Expeditions", "Pigeon Island Snorkeling & Diving Co.", "Arugam Bay Surf & East Coast Travels",
                "Kitulgala White Water Rafting Adventures", "Anuradhapura Sacred City Pilgrimages", "Polonnaruwa Ancient Ruin Explorers",
                "Dambulla Cave Temple & Rock Trails", "Tangalle Secluded Beach Escapes", "Pasikuda Shallow Bay Marine Tours",
                "Colombo City Heritage & Tuk-Tuk Tours", "Udawalawe Elephant Sanctuary Safaris", "Bundala Wetland Birding Expeditions",
                "Weligama Bay Surf & Sailing Academy", "Kalpitiya Dolphin & Kite Surfing Co.", "Haputale Lipton's Seat Cloud Walks",
                "Mannar Island Flamingo & Birding Tours", "Kumana National Park Wildlife Safaris", "Wasgamuwa Wilderness Wildlife Tours",
                "Galle Literary & Art Festival Walks", "Island Breeze Tailor-Made Ceylon Tours"
        };

        String[] agencyPhotos = {
                "https://images.unsplash.com/photo-1546708973-b339540b5162",
                "https://images.unsplash.com/photo-1534177616072-ef7dc120449d",
                "https://images.unsplash.com/photo-1578632767115-351597cf2477",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        };

        List<TourAgency> list = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            SriLankanCity city = cities[i % cities.length];
            Region region = getRegionForCity(city);
            String name = agencyNames[i];
            String ownerId = "agency_owner_" + (i + 1);

            TourAgency a = new TourAgency();
            a.setName(name);
            a.setTagline("Accredited Travel Operator & Safari Specialists in " + city.name().replace("_", " "));
            a.setDescription(name + " is a licensed Sri Lanka Tourism Development Authority (SLTDA) registered agency specializing in tailor-made itineraries, private chauffeur journeys, wildlife safaris, and cultural immersions.");
            a.setContactEmail("info@" + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".lk");
            a.setContactPhone("+94 " + (720000000 + i * 23456));
            a.setWhatsappNumber("+94 " + (760000000 + i * 65432));
            a.setWebsite("https://www." + name.toLowerCase().replaceAll("[^a-z0-9]", "") + ".lk");
            a.setOwnerId(ownerId);
            a.setStatus(ApprovalStatus.APPROVED);
            a.setVerificationStatus(VerificationStatus.VERIFIED);
            a.setCity(city);
            a.setRegion(region);
            a.setLatitude(6.5 + (i % 8) * 0.25);
            a.setLongitude(80.2 + (i % 8) * 0.2);
            a.setAddressLine("Level " + (1 + (i % 4)) + ", Royal Commercial Tower, " + city.name().replace("_", " "));
            a.setCoverImageUrl(agencyPhotos[i % agencyPhotos.length]);
            a.setGalleryImageUrls(Arrays.asList(agencyPhotos[(i + 1) % agencyPhotos.length], agencyPhotos[(i + 2) % agencyPhotos.length]));
            a.setAverageRating(4.6 + (i % 4) * 0.1);
            a.setReviewCount(24 + i * 5);
            a.setResponseTimeHours(0.8);
            a.setResponseRate(99.0);
            a.setYearsInBusiness(6 + (i % 18));
            a.setCancellationPolicy(CancellationPolicy.FLEXIBLE);
            a.setPaymentMethods(Arrays.asList(PaymentMethod.ONLINE_PAYMENT, PaymentMethod.PAY_AT_PROPERTY, PaymentMethod.BANK_TRANSFER));
            a.setSustainabilityBadges(Arrays.asList(SustainabilityBadge.ECO_CERTIFIED, SustainabilityBadge.LOCALLY_OWNED, SustainabilityBadge.PLASTIC_FREE));
            a.setLicenseNumber("SLTDA/TA/2026/" + (2000 + i));
            a.setPartnerNetworkSize(15 + i * 3);
            a.setSpecializations(Arrays.asList(
                    AgencySpecialization.WILDLIFE_SAFARI, AgencySpecialization.CULTURAL_TRIANGLE,
                    AgencySpecialization.HILL_COUNTRY_TREKKING, AgencySpecialization.HONEYMOON
            ));
            a.setFleetTypes(Arrays.asList(VehicleType.SUV, VehicleType.VAN, VehicleType.COACH));

            TourAgency savedAgency = businessRepository.save(a);

            // Seed 2-3 Multi-Day Tour Packages per Agency
            seedToursForAgency(savedAgency, amenities, agencyPhotos, i);

            // Seed Reviews & FAQs
            seedReviewsForEntity(savedAgency.getId(), ReviewEntityType.TOUR_AGENCY, savedAgency.getName());
            seedFaqsForBusiness(savedAgency);

            list.add(savedAgency);
        }
        return list;
    }

    private void seedToursForAgency(TourAgency agency, Map<String, Amenity> amenities, String[] photos, int index) {
        String[] titles = {
                "7-Day Grand Cultural Triangle & Yala Safari Expedition",
                "3-Day Hill Country Scenic Train, Ella Rock & Tea Trails",
                "5-Day Southern Coastline, Whales & Galle Fort Heritage"
        };
        Integer[] durations = {7, 3, 5};
        Double[] prices = {680.0 + (index % 5) * 50, 260.0 + (index % 5) * 30, 490.0 + (index % 5) * 40};
        TourCategory[] categories = {TourCategory.CULTURAL, TourCategory.ADVENTURE, TourCategory.BEACH};

        for (int t = 0; t < titles.length; t++) {
            TourPackage tp = new TourPackage();
            tp.setTitle(agency.getName() + " - " + titles[t]);
            tp.setDescription("Comprehensive guided multi-day circuit curated by " + agency.getName() + ". Includes luxury air-conditioned transport, SLTDA certified guide, entrance permits, boutique accommodations, and all breakfast/dinner meals.");
            tp.setPrice(prices[t]);
            tp.setCurrency(Currency.USD);
            tp.setDurationDays(durations[t]);
            tp.setCategory(categories[t]);
            tp.setStartingCity(agency.getCity());
            tp.setOwnerId(agency.getOwnerId());
            tp.setOwnerType(OwnerType.TOUR_AGENCY);
            tp.setMinGroupSize(2);
            tp.setMaxGroupSize(16);
            tp.setImageUrls(Arrays.asList(
                    photos[(index + t) % photos.length],
                    photos[(index + t + 1) % photos.length]
            ));
            tp.setDifficultyLevel(t == 1 ? DifficultyLevel.MODERATE : DifficultyLevel.EASY);
            tp.setPhysicalRequirements("Comfortable walking shoes, sun hat, mosquito repellent, and modest attire for temple visits.");
            tp.setTransportModeIncluded(VehicleType.VAN);
            tp.setMealsIncluded(MealPlan.HALF_BOARD);
            tp.setAccommodationIncluded(true);
            tp.setIsPrivateTour(false);
            tp.setInclusions(Arrays.asList(
                    amenities.get("SAFARI_VEHICLE"), amenities.get("CERTIFIED_GUIDE"),
                    amenities.get("MEALS_INCLUDED"), amenities.get("AIR_CONDITIONING")
            ));

            // Group pricing tiers
            GroupPricingTier tier1 = new GroupPricingTier();
            tier1.setTourPackage(tp);
            tier1.setMinTravelers(2);
            tier1.setMaxTravelers(4);
            tier1.setPricePerPerson(tp.getPrice());

            GroupPricingTier tier2 = new GroupPricingTier();
            tier2.setTourPackage(tp);
            tier2.setMinTravelers(5);
            tier2.setMaxTravelers(8);
            tier2.setPricePerPerson(Math.round(tp.getPrice() * 0.88 * 100.0) / 100.0);

            GroupPricingTier tier3 = new GroupPricingTier();
            tier3.setTourPackage(tp);
            tier3.setMinTravelers(9);
            tier3.setMaxTravelers(null);
            tier3.setPricePerPerson(Math.round(tp.getPrice() * 0.80 * 100.0) / 100.0);

            tp.setPricingTiers(Arrays.asList(tier1, tier2, tier3));

            List<ItineraryDay> days = new ArrayList<>();
            for (int d = 1; d <= durations[t]; d++) {
                ItineraryDay iday = new ItineraryDay();
                iday.setTourPackage(tp);
                iday.setDayNumber(d);
                iday.setTitle("Day " + d + ": Scenic Circuit & Exploration");
                iday.setDescription("Breakfast at hotel, private transit to iconic heritage landmarks, local culinary lunch, and evening leisure.");
                iday.setOvernightLocation(agency.getCity().name().replace("_", " "));
                iday.setMeals(Arrays.asList(MealPlan.HALF_BOARD));
                days.add(iday);
            }
            tp.setItineraryDays(days);
            tourPackageRepository.save(tp);
        }
    }

    private List<TourGuideProfile> seedTourGuides(Map<String, Amenity> amenities) {
        SriLankanCity[] cities = SriLankanCity.values();
        String[] guideNames = {
                "Kasun Perera", "Chaminda Silva", "Roshan Fernando", "Dinesh Wickramasinghe", "Nimal Bandara",
                "Priyantha Kumara", "Sanjeewa Jayawardena", "Mahendra Senanayake", "Asanka Rajapaksha", "Nuwan Gamage",
                "Thilina Abeysekara", "Lakmal Dissanayake", "Suranga Cooray", "Ravi Jayasuriya", "Pradeep Gunawardena",
                "Sunil Weerasinghe", "Manjula Pathirana", "Janaka Hettiarachchi", "Gayan Karunaratne", "Indika Samarasinghe",
                "Ruwan Ratnayake", "Danushka Mendis", "Chathura Alwis", "Sampath Jayakody", "Kanishka Ranasinghe",
                "Suresh Jayatillake", "Dilshan Peiris", "Anura Wickrama", "Harsha Liyanage", "Kamal Jayamaha",
                "Nadeesha Ekanayake", "Sudath Balasuriya", "Buddhika Herath", "Upul Senaratne", "Lalith Wijesinghe",
                "Channa Jayasekera", "Kolitha Perera", "Bandula Seneviratne", "Ranjith Tennakoon", "Nalin De Silva",
                "Jagath Siriwardena", "Prasanna Jayakody", "Manoj Samarawickrama", "Rohana Jayasinghe", "Vipula Abeywardena",
                "Thusitha Mallikarachchi", "Samantha Wijethunga", "Keerthi Basnayake", "Rohan Liyanapathirana", "Duminda Senarath"
        };

        String[] guidePhotos = {
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
        };

        VehicleType[] vTypes = {VehicleType.SUV, VehicleType.VAN, VehicleType.SEDAN, VehicleType.TUK_TUK, VehicleType.NONE};
        String[] vehicleModels = {"Toyota Prado 4x4", "Toyota KDH Super GL Luxury", "Toyota Prius Hybrid", "Tuk-Tuk Safari Spec", "Walking / On Foot"};

        List<TourGuideProfile> list = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            SriLankanCity city = cities[i % cities.length];
            Region region = getRegionForCity(city);
            String name = guideNames[i];
            String userId = "guide_user_" + (i + 1);

            TourGuideProfile g = new TourGuideProfile();
            g.setUserId(userId);
            g.setName(name);
            g.setTagline("SLTDA Certified " + (i % 2 == 0 ? "National Tourist Guide" : "Chauffeur Guide") + " in " + city.name().replace("_", " "));
            g.setDescription("Hello! I am " + name + ", an experienced licensed tour guide with over " + (4 + (i % 18)) + " years exploring Sri Lanka's wildlife sanctuaries, tea plantations, and ancient kingdoms. Passionate about authentic local storytelling, birdwatching, and customized family journeys.");
            g.setContactEmail(name.toLowerCase().replace(" ", ".") + "@blueceylon.lk");
            g.setContactPhone("+94 " + (770000000 + i * 11111));
            g.setWhatsappNumber("+94 " + (770000000 + i * 11111));
            g.setWebsite("https://blueceylon.lk/guide/" + userId);
            g.setStatus(ApprovalStatus.APPROVED);
            g.setCity(city);
            g.setRegion(region);
            g.setLatitude(6.2 + (i % 9) * 0.28);
            g.setLongitude(80.1 + (i % 9) * 0.22);
            g.setAddressLine("No. " + (5 + i) + ", Heritage Lane, " + city.name().replace("_", " "));
            g.setCoverImageUrl(guidePhotos[i % guidePhotos.length]);
            g.setSltdaLicenseNumber("SLTDA/NTG/2026/" + (3000 + i));
            g.setLicenseType(i % 3 == 0 ? "NATIONAL_TOURIST_GUIDE" : "CHAUFFEUR_TOURIST_GUIDE");
            g.setYearsOfExperience(4 + (i % 18));
            g.setVehicleType(vTypes[i % vTypes.length]);
            g.setVehicleModel(vehicleModels[i % vehicleModels.length]);
            g.setVehicleAirConditioned(vTypes[i % vTypes.length] != VehicleType.NONE && vTypes[i % vTypes.length] != VehicleType.TUK_TUK);
            g.setMaxGroupSizeGuided(6 + (i % 8));
            g.setDailyRate(55.0 + (i % 6) * 15);
            g.setHalfDayRate(35.0 + (i % 6) * 10);
            g.setCurrency(Currency.USD);
            g.setAverageRating(4.7 + (i % 3) * 0.1);
            g.setReviewCount(18 + i * 3);
            g.setResponseTimeHours(0.5);
            g.setResponseRate(100.0);
            g.setLanguagesSpoken(Arrays.asList("English", i % 2 == 0 ? "German" : "French", "Sinhala"));

            // Blackout dates
            GuideBlackoutDate bo1 = new GuideBlackoutDate();
            bo1.setGuide(g);
            bo1.setBlockedDate(LocalDate.now().plusDays(5 + (i % 10)));
            bo1.setReason("Booked - Full Day Private Excursion");
            bo1.setAutoBlockedByBooking(true);

            GuideBlackoutDate bo2 = new GuideBlackoutDate();
            bo2.setGuide(g);
            bo2.setBlockedDate(LocalDate.now().plusDays(15 + (i % 10)));
            bo2.setReason("Vehicle Maintenance / Scheduled Rest");
            bo2.setAutoBlockedByBooking(false);

            g.setBlackoutDates(Arrays.asList(bo1, bo2));

            TourGuideProfile savedGuide = guideRepository.save(g);

            // Seed 1-2 Private Guide Tours
            seedToursForGuide(savedGuide, amenities, guidePhotos, i);

            // Seed Reviews for Guide
            seedReviewsForEntity(savedGuide.getId(), ReviewEntityType.TOUR_GUIDE, savedGuide.getName());

            list.add(savedGuide);
        }
        return list;
    }

    private void seedToursForGuide(TourGuideProfile guide, Map<String, Amenity> amenities, String[] photos, int index) {
        String[] titles = {
                "Private " + guide.getCity().name().replace("_", " ") + " Secret Waterfall & Trekking Walk",
                "Authentic " + guide.getCity().name().replace("_", " ") + " Village Life & Cooking Masterclass"
        };

        for (int t = 0; t < 2; t++) {
            TourPackage tp = new TourPackage();
            tp.setTitle(guide.getName() + " - " + titles[t]);
            tp.setDescription("Join private licensed guide " + guide.getName() + " for an intimate discovery of " + guide.getCity().name().replace("_", " ") + ". Avoid tourist crowds, explore hidden scenic trails, and experience warm Sri Lankan hospitality.");
            tp.setPrice(45.0 + t * 25.0 + (index % 4) * 5);
            tp.setCurrency(Currency.USD);
            tp.setDurationDays(1);
            tp.setCategory(t == 0 ? TourCategory.ADVENTURE : TourCategory.CULTURAL);
            tp.setStartingCity(guide.getCity());
            tp.setOwnerId(guide.getUserId());
            tp.setOwnerType(OwnerType.TOUR_GUIDE);
            tp.setMinGroupSize(1);
            tp.setMaxGroupSize(guide.getMaxGroupSizeGuided() != null ? guide.getMaxGroupSizeGuided() : 6);
            tp.setImageUrls(Arrays.asList(photos[(index + t) % photos.length]));
            tp.setDifficultyLevel(DifficultyLevel.EASY);
            tp.setPhysicalRequirements("Light casual clothes, comfortable walking shoes, and water bottle.");
            tp.setTransportModeIncluded(guide.getVehicleType() != null ? guide.getVehicleType() : VehicleType.NONE);
            tp.setMealsIncluded(MealPlan.BREAKFAST_ONLY);
            tp.setAccommodationIncluded(false);
            tp.setIsPrivateTour(true);
            tp.setInclusions(Arrays.asList(amenities.get("CERTIFIED_GUIDE"), amenities.get("MEALS_INCLUDED")));

            ItineraryDay iday = new ItineraryDay();
            iday.setTourPackage(tp);
            iday.setDayNumber(1);
            iday.setTitle("Full Day Private Guided Experience");
            iday.setDescription("Meet guide at designated spot, personalized scenic route, artisan lunch, and panoramic photography stops.");
            iday.setOvernightLocation(guide.getCity().name().replace("_", " "));
            iday.setMeals(Arrays.asList(MealPlan.BREAKFAST_ONLY));
            tp.setItineraryDays(Collections.singletonList(iday));

            tourPackageRepository.save(tp);
        }
    }

    private void seedReviewsForEntity(String entityId, ReviewEntityType type, String entityName) {
        String[] reviewers = {"Emma Watson", "Alexander Schmidt", "Sophie Dubois", "Lucas Rossi", "Oliver Brown", "Liam Taylor"};
        String[] countries = {"United Kingdom", "Germany", "France", "Italy", "Australia", "Canada"};
        String[] comments = {
                "Absolutely breathtaking experience! The hospitality, attention to detail, and authentic vibe at " + entityName + " exceeded all our expectations.",
                "Highlight of our Sri Lankan trip! Everything was seamless, professional, and world-class. Highly recommended to all international travelers.",
                "Memorable stay and excursions. The staff and guides were so kind, knowledgeable, and caring. Will definitely return next year!"
        };

        for (int i = 0; i < comments.length; i++) {
            Review r = new Review();
            r.setEntityId(entityId);
            r.setEntityType(type);
            r.setReviewerUserId("rev_user_" + (i + 1));
            r.setReviewerName(reviewers[i % reviewers.length]);
            r.setReviewerCountry(countries[i % countries.length]);
            r.setRating(5);
            r.setComment(comments[i]);
            r.setStayOrTourDate(LocalDate.now().minusWeeks(i + 1));
            r.setVerified(true);
            r.setBookingReference("BC-REV-" + (10000 + i * 37));
            r.setProviderResponse("Thank you so much for your kind words! It was our pleasure hosting you.");
            r.setProviderResponseAt(java.time.Instant.now());
            reviewRepository.save(r);
        }
    }

    private void seedFaqsForBusiness(Business b) {
        String[][] faqs = {
                {"What is the cancellation and refund policy?", "We offer flexible cancellations up to 48 hours before check-in/tour departure with full refund."},
                {"Do you provide airport transfer services from Colombo Bandaranaike (CMB)?", "Yes! We offer private air-conditioned chauffeur airport pickups and drop-offs on request."},
                {"Are dietary preferences (Vegetarian, Vegan, Halal, Gluten-Free) catered for?", "Absolutely! Our culinary teams prepare delicious customized authentic and Western dishes tailored to all dietary requirements."}
        };

        for (int i = 0; i < faqs.length; i++) {
            FaqEntry f = new FaqEntry();
            f.setBusinessId(b.getId());
            f.setQuestion(faqs[i][0]);
            f.setAnswer(faqs[i][1]);
            faqEntryRepository.save(f);
        }
    }

    private Region getRegionForCity(SriLankanCity city) {
        switch (city) {
            case COLOMBO:
            case NEGOMBO:
                return Region.WESTERN_PROVINCE;
            case GALLE:
            case MIRISSA:
                return Region.SOUTH_COAST;
            case KANDY:
            case ELLA:
            case NUWARA_ELIYA:
                return Region.HILL_COUNTRY;
            case SIGIRIYA:
            case ANURADHAPURA:
                return Region.CULTURAL_TRIANGLE;
            case YALA:
                return Region.WILDLIFE_BELT;
            case TRINCOMALEE:
                return Region.EAST_COAST;
            default:
                return Region.WESTERN_PROVINCE;
        }
    }
}
