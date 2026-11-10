const fs = require('fs');
const path = require('path');

const cities = [
  'COLOMBO', 'GALLE', 'KANDY', 'ELLA', 'SIGIRIYA', 'MIRISSA', 
  'NUWARA_ELIYA', 'YALA', 'TRINCOMALEE', 'NEGOMBO', 'ANURADHAPURA'
];

const cityRegions = {
  COLOMBO: 'WESTERN_PROVINCE',
  NEGOMBO: 'WESTERN_PROVINCE',
  GALLE: 'SOUTH_COAST',
  MIRISSA: 'SOUTH_COAST',
  KANDY: 'HILL_COUNTRY',
  ELLA: 'HILL_COUNTRY',
  NUWARA_ELIYA: 'HILL_COUNTRY',
  SIGIRIYA: 'CULTURAL_TRIANGLE',
  ANURADHAPURA: 'CULTURAL_TRIANGLE',
  YALA: 'WILDLIFE_BELT',
  TRINCOMALEE: 'EAST_COAST'
};

const hotelNames = [
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
];

const agencyNames = [
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
];

const guideNames = [
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
];

const hotelPhotos = [
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
];

const guidePhotos = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
];

const propertyTypes = ['BOUTIQUE', 'RESORT', 'HOTEL', 'VILLA', 'ECO_LODGE'];
const vehicleTypes = ['SUV', 'VAN', 'CAR', 'TUK_TUK'];
const vehicleModels = ['Toyota Prado 4x4', 'Toyota KDH Super GL Luxury', 'Toyota Prius Hybrid', 'Tuk-Tuk Safari Spec'];

let out = `-- =============================================================================\n`;
out += `-- BLUE CEYLON - COMPREHENSIVE SEED DATA FOR ALL SERVICES & DATABASES\n`;
out += `-- =============================================================================\n\n`;

out += `\\c catalog_db;\n\n`;

// Amenities
const amenityList = [
  ['am_wifi', 'FREE_WIFI', 'Free High-Speed Wi-Fi', 'wifi', 'HOTEL'],
  ['am_pool', 'SWIMMING_POOL', 'Infinity Swimming Pool', 'waves', 'HOTEL'],
  ['am_ac', 'AIR_CONDITIONING', 'Climate Control A/C', 'wind', 'ROOM'],
  ['am_spa', 'SPA_WELLNESS', 'Ayurvedic Spa & Wellness', 'sparkles', 'HOTEL'],
  ['am_ocean', 'OCEAN_VIEW', 'Panoramic Ocean View', 'sun', 'ROOM'],
  ['am_mtn', 'MOUNTAIN_VIEW', 'Misty Mountain View', 'mountain', 'ROOM'],
  ['am_balc', 'PRIVATE_BALCONY', 'Private Balcony / Terrace', 'door-open', 'ROOM'],
  ['am_bfast', 'BREAKFAST_INCLUDED', 'Artisan Ceylon Breakfast', 'coffee', 'HOTEL'],
  ['am_roomsvc', 'ROOM_SERVICE_247', '24/7 Butler & Room Service', 'bell', 'HOTEL'],
  ['am_shuttle', 'AIRPORT_SHUTTLE', 'Luxury Airport Chauffeur', 'car', 'HOTEL'],
  ['am_safari', 'SAFARI_VEHICLE', '4x4 Open-Top Safari Jeep', 'truck', 'TOUR'],
  ['am_guide', 'CERTIFIED_GUIDE', 'English / Multilingual Guide', 'user-check', 'TOUR'],
  ['am_solar', 'SOLAR_POWERED', '100% Solar Powered Eco-Grid', 'sun', 'HOTEL'],
  ['am_pets', 'PETS_WELCOME', 'Pet Friendly Facilities', 'dog', 'HOTEL'],
  ['am_gym', 'FITNESS_CENTER', 'Modern Fitness & Gym', 'dumbbell', 'HOTEL'],
  ['am_minibar', 'MINI_BAR', 'Fully Stocked Gourmet Mini-Bar', 'wine', 'ROOM'],
  ['am_tea', 'TEA_COFFEE_MAKER', 'Organic Ceylon Tea & Espresso Bar', 'cup-soda', 'ROOM'],
  ['am_hotwater', 'HOT_WATER', 'Rain Shower & Hot Water', 'droplet', 'ROOM'],
  ['am_jacuzzi', 'JACUZZI', 'Heated Private Jacuzzi', 'bath', 'ROOM'],
  ['am_beach', 'BEACH_FRONT', 'Direct Private Beach Access', 'umbrella', 'HOTEL'],
  ['am_snorkel', 'SNORKELING_GEAR', 'Snorkeling & Scuba Gear Included', 'anchor', 'TOUR'],
  ['am_binoc', 'BINOCULARS', 'High-Definition Safari Binoculars', 'eye', 'TOUR'],
  ['am_camp', 'CAMPING_GEAR', 'Waterproof Trekking & Camping Gear', 'tent', 'TOUR'],
  ['am_meals', 'MEALS_INCLUDED', 'All Meals & Refreshments Included', 'utensils', 'TOUR']
];

out += `-- 1. Master Amenities\n`;
for (const a of amenityList) {
  out += `INSERT INTO amenities (id, code, label, icon_key, scope, created_at, updated_at) ` +
    `VALUES ('${a[0]}', '${a[1]}', '${a[2]}', '${a[3]}', '${a[4]}', NOW(), NOW()) ` +
    `ON CONFLICT (code) DO UPDATE SET label = EXCLUDED.label;\n`;
}
out += `\n`;

// 50 Hotels
out += `-- 2. 50 Hotels\n`;
for (let i = 0; i < 50; i++) {
  const id = `htl_${i + 1}`;
  const city = cities[i % cities.length];
  const region = cityRegions[city];
  const pType = propertyTypes[i % propertyTypes.length];
  const name = hotelNames[i].replace(/'/g, "''");
  const ownerId = `hotel_owner_${i + 1}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const coverImg = hotelPhotos[i % hotelPhotos.length];
  const email = `reservations@${slug}.com`;
  const phone = `+94 71 ${1000000 + i * 12345}`;
  const whatsapp = `+94 77 ${1000000 + i * 54321}`;
  const web = `https://www.${slug}.com`;
  const addr = `No. ${10 + i}, Beach & Sanctuary Road, ${city}`;
  const rating = (4.5 + (i % 5) * 0.1).toFixed(1);
  const revCount = 15 + i * 4;
  const lat = (6.0 + (i % 10) * 0.3).toFixed(4);
  const lon = (80.0 + (i % 10) * 0.2).toFixed(4);
  const lic = `SLTDA/HOTEL/2026/${1000 + i}`;

  out += `INSERT INTO businesses (id, business_type, name, tagline, description, contact_email, contact_phone, whatsapp_number, website, owner_id, status, verification_status, city, region, latitude, longitude, address_line, cover_image_url, average_rating, review_count, response_time_hours, response_rate, years_in_business, cancellation_policy, star_rating, total_branches, property_type, check_in_time, check_out_time, pet_policy, total_rooms, offers_day_out_packages, offers_night_out_packages, offers_hourly_booking, sltda_license_number, created_at, updated_at) ` +
    `VALUES ('${id}', 'HOTEL', '${name}', 'Exclusive ${pType} in ${city}', 'Experience world-renowned Sri Lankan luxury at ${name}. Surrounded by pristine landscapes in ${city}, featuring award-winning architecture, fine Ceylon dining, and personalized hospitality.', '${email}', '${phone}', '${whatsapp}', '${web}', '${ownerId}', 'APPROVED', 'VERIFIED', '${city}', '${region}', ${lat}, ${lon}, '${addr}', '${coverImg}', ${rating}, ${revCount}, 1.2, 98.5, ${5 + (i % 15)}, 'FLEXIBLE', ${3 + (i % 3)}, 1, '${pType}', '14:00:00', '11:00:00', 'ALLOWED', ${10 + i * 2}, true, true, true, '${lic}', NOW(), NOW()) ` +
    `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, cover_image_url = EXCLUDED.cover_image_url;\n`;

  // Business Gallery Images
  out += `INSERT INTO business_gallery_images (business_id, image_url) VALUES ` +
    `('${id}', '${hotelPhotos[(i + 1) % hotelPhotos.length]}'), ` +
    `('${id}', '${hotelPhotos[(i + 2) % hotelPhotos.length]}'), ` +
    `('${id}', '${hotelPhotos[(i + 3) % hotelPhotos.length]}') ` +
    `ON CONFLICT DO NOTHING;\n`;

  // Business Translations
  out += `INSERT INTO business_translations (id, business_id, locale, name, description, created_at, updated_at) VALUES ` +
    `('bt_htl_${i + 1}_si', '${id}', 'SI', '${name} (සිංහල)', '${name} - සුවපහසු හෝටල් අත්දැකීමක් සඳහා අදම වෙන්කරවා ගන්න.', NOW(), NOW()), ` +
    `('bt_htl_${i + 1}_ta', '${id}', 'TA', '${name} (தமிழ்)', '${name} - உலகத்தரம் வாய்ந்த சொகுசு தங்குமிடம்.', NOW(), NOW()) ` +
    `ON CONFLICT (business_id, locale) DO UPDATE SET name = EXCLUDED.name;\n`;

  // Hotel Amenities
  out += `INSERT INTO business_amenities (business_id, amenity_id) VALUES ` +
    `('${id}', 'am_wifi'), ('${id}', 'am_pool'), ('${id}', 'am_ac'), ('${id}', 'am_spa'), ('${id}', 'am_bfast'), ('${id}', 'am_roomsvc') ` +
    `ON CONFLICT DO NOTHING;\n`;

  // Hotel Rooms (4 per hotel)
  const roomConfigs = [
    ['Deluxe King Room', 'DELUXE', 85 + (i % 5) * 15, '1 Extra-Large King Bed', 2, 1, 38.0, 'SEA_VIEW'],
    ['Presidential Ocean Suite', 'SUITE', 175 + (i % 5) * 30, '1 King Bed + 1 Sofa Bed', 3, 2, 65.0, 'SEA_VIEW'],
    ['Standard Garden Chalet', 'STANDARD', 110 + (i % 5) * 20, '2 Queen Beds', 4, 2, 48.0, 'MOUNTAIN_VIEW'],
    ['Private Pool Villa', 'VILLA', 290 + (i % 5) * 50, '1 Master King + 2 Twin Beds', 5, 3, 92.0, 'SEA_VIEW']
  ];

  for (let r = 0; r < roomConfigs.length; r++) {
    const roomId = `rm_${i + 1}_${r + 1}`;
    const rc = roomConfigs[r];
    const roomTitle = `${name} - ${rc[0]}`.replace(/'/g, "''");
    out += `INSERT INTO rooms (id, hotel_id, room_number, display_name, room_type, city, price_per_night, currency, capacity, bed_count, size_square_meters, available_from, available_to, total_units, view_type, bed_configuration, smoking_allowed, is_hourly_bookable, created_at, updated_at, version) ` +
      `VALUES ('${roomId}', '${id}', '${101 + r * 10}', '${roomTitle}', '${rc[1]}', '${city}', ${rc[2]}, 'USD', ${rc[4]}, ${rc[5]}, ${rc[6]}, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', ${4 + r * 2}, '${rc[7]}', '${rc[3]}', false, true, NOW(), NOW(), 0) ` +
      `ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, price_per_night = EXCLUDED.price_per_night;\n`;

    out += `INSERT INTO room_image_urls (room_id, image_url) VALUES ` +
      `('${roomId}', '${hotelPhotos[(i + r) % hotelPhotos.length]}'), ` +
      `('${roomId}', '${hotelPhotos[(i + r + 1) % hotelPhotos.length]}') ` +
      `ON CONFLICT DO NOTHING;\n`;

    out += `INSERT INTO room_amenities (room_id, amenity_id) VALUES ` +
      `('${roomId}', 'am_wifi'), ('${roomId}', 'am_ac'), ('${roomId}', 'am_balc'), ('${roomId}', 'am_minibar'), ('${roomId}', 'am_tea'), ('${roomId}', 'am_hotwater') ` +
      `ON CONFLICT DO NOTHING;\n`;

    // Hourly Room Booking options
    const hrId = `hr_${roomId}`;
    out += `INSERT INTO hourly_room_bookings (id, room_id, minimum_hours, maximum_hours, hourly_rate, currency, extra_hour_rate, available_slots, max_occupancy, cleaning_buffer_minutes, id_verification_required, created_at, updated_at) ` +
      `VALUES ('${hrId}', '${roomId}', 2, 6, 18.0, 'USD', 10.0, '09:00-12:00,13:00-17:00,18:00-22:00', ${rc[4]}, 30, true, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Hotel Tours (2 per hotel)
  for (let t = 0; t < 2; t++) {
    const tourId = `tp_htl_${i + 1}_${t + 1}`;
    const tourTitle = t === 0 ? `${name} - ${city} Sunrise Safari & Heritage Expedition` : `${name} - Scenic Highland & Waterfall Discovery Tour`;
    const dur = t === 0 ? 1 : 2;
    const cat = t === 0 ? 'WILDLIFE' : 'ADVENTURE';
    const price = 95.0 + t * 65.0 + (i % 4) * 10;

    out += `INSERT INTO tour_packages (id, title, description, base_price, currency, duration_days, category, starting_city, owner_id, owner_type, min_group_size, max_group_size, difficulty_level, physical_requirements, transport_mode_included, meals_included, accommodation_included, is_private_tour, created_at, updated_at) ` +
      `VALUES ('${tourId}', '${tourTitle.replace(/'/g, "''")}', 'Exclusive curated island expedition departing directly from ${name}. Enjoy private chauffeur transport, licensed naturalist guidance, scenic tea valleys, wildlife viewing, and gourmet picnic meals.', ${price}, 'USD', ${dur}, '${cat}', '${city}', '${ownerId}', 'HOTEL', 1, 8, 'EASY', 'Light walking shoes, camera, sunglasses, and comfortable outdoor attire.', 'SUV', 'FULL_BOARD', ${t > 0}, true, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, base_price = EXCLUDED.base_price;\n`;

    // Group Pricing Tiers
    out += `INSERT INTO group_pricing_tiers (id, tour_id, min_travelers, max_travelers, price_per_person, created_at, updated_at) VALUES ` +
      `('gpt_${tourId}_1', '${tourId}', 1, 2, ${price}, NOW(), NOW()), ` +
      `('gpt_${tourId}_2', '${tourId}', 3, 5, ${(price * 0.88).toFixed(2)}, NOW(), NOW()), ` +
      `('gpt_${tourId}_3', '${tourId}', 6, NULL, ${(price * 0.78).toFixed(2)}, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;

    // Tour Package Translations
    out += `INSERT INTO tour_package_translations (id, tour_id, locale, title, description, created_at, updated_at) VALUES ` +
      `('tpt_${tourId}_si', '${tourId}', 'SI', '${tourTitle.replace(/'/g, "''")} (සිංහල)', 'ශ්‍රී ලංකාවේ අසිරිමත් ස්වභාවික ස්ථාන නැරඹීමේ සුවිශේෂී සංචාරය.', NOW(), NOW()), ` +
      `('tpt_${tourId}_ta', '${tourId}', 'TA', '${tourTitle.replace(/'/g, "''")} (தமிழ்)', 'இலங்கையின் சிறந்த சுற்றுலா அனுபவத்தை பெறுங்கள்.', NOW(), NOW()) ` +
      `ON CONFLICT (tour_id, locale) DO UPDATE SET title = EXCLUDED.title;\n`;

    out += `INSERT INTO tour_image_urls (tour_id, image_url) VALUES ` +
      `('${tourId}', '${hotelPhotos[(i + t) % hotelPhotos.length]}'), ` +
      `('${tourId}', '${hotelPhotos[(i + t + 2) % hotelPhotos.length]}') ` +
      `ON CONFLICT DO NOTHING;\n`;

    out += `INSERT INTO tour_amenities (tour_id, amenity_id) VALUES ` +
      `('${tourId}', 'am_safari'), ('${tourId}', 'am_guide'), ('${tourId}', 'am_binoc'), ('${tourId}', 'am_meals') ` +
      `ON CONFLICT DO NOTHING;\n`;

    for (let d = 1; d <= dur; d++) {
      const itId = `it_${tourId}_${d}`;
      out += `INSERT INTO itinerary_days (id, tour_id, day_number, title, description, overnight_location, created_at, updated_at) ` +
        `VALUES ('${itId}', '${tourId}', ${d}, 'Day ${d}: Exploring ${city}', 'Morning departure with private guide, nature trails, temple visits, and scenic sunset viewpoint.', '${city}', NOW(), NOW()) ` +
        `ON CONFLICT (tour_id, day_number) DO UPDATE SET title = EXCLUDED.title;\n`;
      out += `INSERT INTO itinerary_day_meals (itinerary_day_id, meal) VALUES ('${itId}', 'FULL_BOARD') ON CONFLICT DO NOTHING;\n`;
    }
  }

  // Day Out Package
  const dayPkgId = `dop_${i + 1}`;
  out += `INSERT INTO day_out_packages (id, hotel_id, title, description, price, currency, pricing_unit, start_time, end_time, max_occupancy, daily_limit, created_at, updated_at) ` +
    `VALUES ('${dayPkgId}', '${id}', '${name} - Signature Luxury Day Pass', 'Spend a relaxing day enjoying the infinity pool, 3-course chef lunch, wellness garden access, and afternoon Ceylon tea.', ${35.0 + (i % 3) * 10}, 'USD', 'PER_PERSON', '09:00:00', '18:00:00', 25, 15, NOW(), NOW()) ` +
    `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;\n`;

  // Night Out Package
  const nightPkgId = `nop_${i + 1}`;
  out += `INSERT INTO night_out_packages (id, hotel_id, title, description, price, currency, pricing_unit, start_time, end_time, includes_overnight_stay, max_occupancy, daily_limit, created_at, updated_at) ` +
    `VALUES ('${nightPkgId}', '${id}', '${name} - Moonlight Seafood BBQ & Bonfire Evening', 'Evening dining package under the stars with live acoustic music, premium seafood BBQ buffet, and cocktail lounge access.', ${45.0 + (i % 3) * 10}, 'USD', 'PER_PERSON', '18:30:00', '23:00:00', false, 30, 20, NOW(), NOW()) ` +
    `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;\n`;

  // Reviews
  for (let rev = 1; rev <= 3; rev++) {
    const revId = `rev_htl_${i + 1}_${rev}`;
    out += `INSERT INTO reviews (id, entity_id, entity_type, reviewer_user_id, reviewer_name, reviewer_country, rating, comment, stay_or_tour_date, verified, booking_reference, provider_response, provider_response_at, created_at, updated_at) ` +
      `VALUES ('${revId}', '${id}', 'HOTEL', 'usr_rev_${rev}', 'Guest Traveler ${rev}', 'United Kingdom', 5, 'Exceptional experience at ${name}! Everything was impeccable.', CURRENT_DATE - INTERVAL '${rev * 7} days', true, 'BC-REV-${10000 + i * 10 + rev}', 'Thank you for your review!', NOW(), NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;
  }

  // FAQs
  out += `INSERT INTO faq_entries (id, business_id, question, answer, created_at, updated_at) VALUES ` +
    `('faq_htl_${i + 1}_1', '${id}', 'What is the check-in and check-out time?', 'Check-in is from 2:00 PM and check-out is until 11:00 AM.', NOW(), NOW()), ` +
    `('faq_htl_${i + 1}_2', '${id}', 'Do you arrange airport transfers?', 'Yes, luxury private chauffeur airport transfers can be arranged upon request.', NOW(), NOW()) ` +
    `ON CONFLICT (id) DO NOTHING;\n`;
}

// 50 Tour Agencies
out += `\n-- 3. 50 Tour Agencies\n`;
for (let i = 0; i < 50; i++) {
  const id = `agn_${i + 1}`;
  const city = cities[i % cities.length];
  const region = cityRegions[city];
  const name = agencyNames[i].replace(/'/g, "''");
  const ownerId = `agency_owner_${i + 1}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const coverImg = hotelPhotos[(i + 4) % hotelPhotos.length];
  const email = `info@${slug}.lk`;
  const phone = `+94 72 ${1000000 + i * 23456}`;
  const whatsapp = `+94 76 ${1000000 + i * 65432}`;
  const web = `https://www.${slug}.lk`;
  const addr = `Level ${1 + (i % 4)}, Royal Commercial Tower, ${city}`;
  const rating = (4.6 + (i % 4) * 0.1).toFixed(1);
  const revCount = 24 + i * 5;
  const lat = (6.5 + (i % 8) * 0.25).toFixed(4);
  const lon = (80.2 + (i % 8) * 0.2).toFixed(4);
  const lic = `SLTDA/TA/2026/${2000 + i}`;

  out += `INSERT INTO businesses (id, business_type, name, tagline, description, contact_email, contact_phone, whatsapp_number, website, owner_id, status, verification_status, city, region, latitude, longitude, address_line, cover_image_url, average_rating, review_count, response_time_hours, response_rate, years_in_business, cancellation_policy, sltda_license_number, partner_network_size, created_at, updated_at) ` +
    `VALUES ('${id}', 'TOUR_AGENCY', '${name}', 'Accredited Travel Operator & Safari Specialists in ${city}', '${name} is a licensed Sri Lanka Tourism Development Authority registered agency specializing in tailor-made itineraries, private journeys, and wildlife safaris.', '${email}', '${phone}', '${whatsapp}', '${web}', '${ownerId}', 'APPROVED', 'VERIFIED', '${city}', '${region}', ${lat}, ${lon}, '${addr}', '${coverImg}', ${rating}, ${revCount}, 0.8, 99.0, ${6 + (i % 18)}, 'FLEXIBLE', '${lic}', ${15 + i * 3}, NOW(), NOW()) ` +
    `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, cover_image_url = EXCLUDED.cover_image_url;\n`;

  // Business Gallery Images
  out += `INSERT INTO business_gallery_images (business_id, image_url) VALUES ` +
    `('${id}', '${hotelPhotos[(i + 1) % hotelPhotos.length]}'), ` +
    `('${id}', '${hotelPhotos[(i + 2) % hotelPhotos.length]}') ` +
    `ON CONFLICT DO NOTHING;\n`;

  // Business Translations
  out += `INSERT INTO business_translations (id, business_id, locale, name, description, created_at, updated_at) VALUES ` +
    `('bt_agn_${i + 1}_si', '${id}', 'SI', '${name} (සිංහල)', '${name} - විශ්වාසනීය සංචාරක සේවාව.', NOW(), NOW()), ` +
    `('bt_agn_${i + 1}_ta', '${id}', 'TA', '${name} (தமிழ்)', '${name} - நம்பகமான சுற்றுலா நிறுவனம்.', NOW(), NOW()) ` +
    `ON CONFLICT (business_id, locale) DO UPDATE SET name = EXCLUDED.name;\n`;

  // Agency Multi-day Tours (3 per agency)
  const agencyTourConfigs = [
    ['7-Day Grand Cultural Triangle & Yala Safari Expedition', 7, 'CULTURAL', 680 + (i % 5) * 50],
    ['3-Day Hill Country Scenic Train, Ella Rock & Tea Trails', 3, 'ADVENTURE', 260 + (i % 5) * 30],
    ['5-Day Southern Coastline, Whales & Galle Fort Heritage', 5, 'BEACH', 490 + (i % 5) * 40]
  ];

  for (let t = 0; t < 3; t++) {
    const tourId = `tp_agn_${i + 1}_${t + 1}`;
    const tc = agencyTourConfigs[t];
    const tourTitle = `${name} - ${tc[0]}`.replace(/'/g, "''");

    out += `INSERT INTO tour_packages (id, title, description, base_price, currency, duration_days, category, starting_city, owner_id, owner_type, min_group_size, max_group_size, difficulty_level, physical_requirements, transport_mode_included, meals_included, accommodation_included, is_private_tour, created_at, updated_at) ` +
      `VALUES ('${tourId}', '${tourTitle}', 'Comprehensive guided multi-day circuit curated by ${name}. Includes luxury air-conditioned transport, SLTDA certified guide, entrance permits, boutique accommodations, and all meals.', ${tc[3]}, 'USD', ${tc[1]}, '${tc[2]}', '${city}', '${ownerId}', 'TOUR_AGENCY', 2, 16, 'EASY', 'Comfortable walking shoes, sun hat, and modest attire for sacred cultural sites.', 'VAN', 'HALF_BOARD', true, false, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, base_price = EXCLUDED.base_price;\n`;

    // Group Pricing Tiers
    out += `INSERT INTO group_pricing_tiers (id, tour_id, min_travelers, max_travelers, price_per_person, created_at, updated_at) VALUES ` +
      `('gpt_${tourId}_1', '${tourId}', 2, 4, ${tc[3]}, NOW(), NOW()), ` +
      `('gpt_${tourId}_2', '${tourId}', 5, 8, ${(tc[3] * 0.88).toFixed(2)}, NOW(), NOW()), ` +
      `('gpt_${tourId}_3', '${tourId}', 9, NULL, ${(tc[3] * 0.80).toFixed(2)}, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;

    out += `INSERT INTO tour_image_urls (tour_id, image_url) VALUES ` +
      `('${tourId}', '${hotelPhotos[(i + t) % hotelPhotos.length]}'), ` +
      `('${tourId}', '${hotelPhotos[(i + t + 1) % hotelPhotos.length]}') ` +
      `ON CONFLICT DO NOTHING;\n`;

    out += `INSERT INTO tour_amenities (tour_id, amenity_id) VALUES ` +
      `('${tourId}', 'am_safari'), ('${tourId}', 'am_guide'), ('${tourId}', 'am_meals'), ('${tourId}', 'am_ac') ` +
      `ON CONFLICT DO NOTHING;\n`;

    for (let d = 1; d <= tc[1]; d++) {
      const itId = `it_${tourId}_${d}`;
      out += `INSERT INTO itinerary_days (id, tour_id, day_number, title, description, overnight_location, created_at, updated_at) ` +
        `VALUES ('${itId}', '${tourId}', ${d}, 'Day ${d}: Iconic Ceylon Circuit', 'Scenic tour highlights, local cuisine tasting, and evening relaxation.', '${city}', NOW(), NOW()) ` +
        `ON CONFLICT (tour_id, day_number) DO UPDATE SET title = EXCLUDED.title;\n`;
      out += `INSERT INTO itinerary_day_meals (itinerary_day_id, meal) VALUES ('${itId}', 'HALF_BOARD') ON CONFLICT DO NOTHING;\n`;
    }
  }

  // Reviews
  for (let rev = 1; rev <= 3; rev++) {
    const revId = `rev_agn_${i + 1}_${rev}`;
    out += `INSERT INTO reviews (id, entity_id, entity_type, reviewer_user_id, reviewer_name, reviewer_country, rating, comment, stay_or_tour_date, verified, booking_reference, provider_response, provider_response_at, created_at, updated_at) ` +
      `VALUES ('${revId}', '${id}', 'TOUR_AGENCY', 'usr_rev_${rev}', 'Explorer ${rev}', 'Germany', 5, 'Flawless execution by ${name}! We had the journey of a lifetime.', CURRENT_DATE - INTERVAL '${rev * 10} days', true, 'BC-REV-${20000 + i * 10 + rev}', 'Thank you for choosing us!', NOW(), NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;
  }

  // FAQs
  out += `INSERT INTO faq_entries (id, business_id, question, answer, created_at, updated_at) VALUES ` +
    `('faq_agn_${i + 1}_1', '${id}', 'What is included in your tour price?', 'All transport in private AC vehicles, SLTDA certified guide, entrance fees, and half-board accommodations are included.', NOW(), NOW()) ` +
    `ON CONFLICT (id) DO NOTHING;\n`;
}

// 50 Tour Guides
out += `\n-- 4. 50 Tour Guides\n`;
for (let i = 0; i < 50; i++) {
  const id = `gd_${i + 1}`;
  const city = cities[i % cities.length];
  const region = cityRegions[city];
  const name = guideNames[i].replace(/'/g, "''");
  const userId = `guide_user_${i + 1}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
  const coverImg = guidePhotos[i % guidePhotos.length];
  const email = `${slug}@blueceylon.lk`;
  const phone = `+94 77 ${1000000 + i * 11111}`;
  const vType = vehicleTypes[i % vehicleTypes.length];
  const vModel = vehicleModels[i % vehicleModels.length];
  const rating = (4.7 + (i % 3) * 0.1).toFixed(1);
  const revCount = 18 + i * 3;
  const lat = (6.2 + (i % 9) * 0.28).toFixed(4);
  const lon = (80.1 + (i % 9) * 0.22).toFixed(4);
  const lic = `SLTDA/NTG/2026/${3000 + i}`;
  const licType = i % 3 === 0 ? 'NATIONAL_TOURIST_GUIDE' : 'CHAUFFEUR_TOURIST_GUIDE';
  const dailyRate = 55.0 + (i % 6) * 15;
  const halfRate = 35.0 + (i % 6) * 10;

  out += `INSERT INTO tour_guide_profiles (id, user_id, name, tagline, description, contact_email, contact_phone, whatsapp_number, website, status, verification_status, city, region, latitude, longitude, address_line, cover_image_url, sltda_license_number, license_type, years_of_experience, vehicle_type, vehicle_model, vehicle_air_conditioned, max_group_size_guided, daily_rate, half_day_rate, currency, average_rating, review_count, response_time_hours, response_rate, created_at, updated_at) ` +
    `VALUES ('${id}', '${userId}', '${name}', 'SLTDA Certified Guide in ${city}', 'Hello! I am ${name}, an experienced licensed tour guide with over ${4 + (i % 18)} years exploring Sri Lanka. Passionate about authentic local culture, wildlife, and nature trails.', '${email}', '${phone}', '${phone}', 'https://blueceylon.lk/guide/${userId}', 'APPROVED', 'VERIFIED', '${city}', '${region}', ${lat}, ${lon}, 'No. ${5 + i}, Heritage Lane, ${city}', '${coverImg}', '${lic}', '${licType}', ${4 + (i % 18)}, '${vType}', '${vModel}', true, ${6 + (i % 8)}, ${dailyRate}, ${halfRate}, 'USD', ${rating}, ${revCount}, 0.5, 100.0, NOW(), NOW()) ` +
    `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, cover_image_url = EXCLUDED.cover_image_url;\n`;

  // Guide Languages
  out += `INSERT INTO guide_languages (guide_id, language) VALUES ` +
    `('${id}', 'English'), ('${id}', '${i % 2 === 0 ? "German" : "French"}'), ('${id}', 'Sinhala') ` +
    `ON CONFLICT DO NOTHING;\n`;

  // Guide Blackout Dates
  out += `INSERT INTO guide_blackout_dates (id, guide_id, blocked_date, reason, auto_blocked_by_booking, created_at, updated_at) VALUES ` +
    `('bo_${id}_1', '${id}', CURRENT_DATE + INTERVAL '${5 + (i % 10)} days', 'Booked - Full Day Private Excursion', true, NOW(), NOW()), ` +
    `('bo_${id}_2', '${id}', CURRENT_DATE + INTERVAL '${15 + (i % 10)} days', 'Vehicle Maintenance & Scheduled Rest', false, NOW(), NOW()) ` +
    `ON CONFLICT (guide_id, blocked_date) DO NOTHING;\n`;

  // Guide Private Tours (2 per guide)
  for (let t = 0; t < 2; t++) {
    const tourId = `tp_gd_${i + 1}_${t + 1}`;
    const tourTitle = t === 0 ? `${name} - Private ${city} Secret Waterfall & Trekking Walk` : `${name} - Authentic ${city} Village Life & Cooking Masterclass`;
    const price = 45.0 + t * 25.0 + (i % 4) * 5;

    out += `INSERT INTO tour_packages (id, title, description, base_price, currency, duration_days, category, starting_city, owner_id, owner_type, min_group_size, max_group_size, difficulty_level, physical_requirements, transport_mode_included, meals_included, accommodation_included, is_private_tour, created_at, updated_at) ` +
      `VALUES ('${tourId}', '${tourTitle.replace(/'/g, "''")}', 'Join private licensed guide ${name} for an intimate discovery of ${city}. Avoid tourist crowds, explore hidden scenic trails, and experience warm Sri Lankan hospitality.', ${price}, 'USD', 1, '${t === 0 ? "ADVENTURE" : "CULTURAL"}', '${city}', '${userId}', 'TOUR_GUIDE', 1, 6, 'EASY', 'Light casual clothes, comfortable walking shoes, and water bottle.', '${vType}', 'BREAKFAST_ONLY', false, true, NOW(), NOW()) ` +
      `ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, base_price = EXCLUDED.base_price;\n`;

    out += `INSERT INTO tour_image_urls (tour_id, image_url) VALUES ` +
      `('${tourId}', '${guidePhotos[(i + t) % guidePhotos.length]}') ` +
      `ON CONFLICT DO NOTHING;\n`;

    out += `INSERT INTO tour_amenities (tour_id, amenity_id) VALUES ` +
      `('${tourId}', 'am_guide'), ('${tourId}', 'am_meals') ` +
      `ON CONFLICT DO NOTHING;\n`;

    const itId = `it_${tourId}_1`;
    out += `INSERT INTO itinerary_days (id, tour_id, day_number, title, description, overnight_location, created_at, updated_at) ` +
      `VALUES ('${itId}', '${tourId}', 1, 'Full Day Private Guided Experience', 'Meet guide at designated spot, personalized scenic route, artisan lunch, and photography stops.', '${city}', NOW(), NOW()) ` +
      `ON CONFLICT (tour_id, day_number) DO UPDATE SET title = EXCLUDED.title;\n`;
    out += `INSERT INTO itinerary_day_meals (itinerary_day_id, meal) VALUES ('${itId}', 'BREAKFAST_ONLY') ON CONFLICT DO NOTHING;\n`;
  }

  // Reviews
  for (let rev = 1; rev <= 3; rev++) {
    const revId = `rev_gd_${i + 1}_${rev}`;
    out += `INSERT INTO reviews (id, entity_id, entity_type, reviewer_user_id, reviewer_name, reviewer_country, rating, comment, stay_or_tour_date, verified, booking_reference, provider_response, provider_response_at, created_at, updated_at) ` +
      `VALUES ('${revId}', '${id}', 'TOUR_GUIDE', 'usr_rev_${rev}', 'Traveler ${rev}', 'Australia', 5, '${name} was an amazing guide! Very knowledgeable, friendly, and punctual.', CURRENT_DATE - INTERVAL '${rev * 5} days', true, 'BC-REV-${30000 + i * 10 + rev}', 'Thank you so much! Safe travels!', NOW(), NOW(), NOW()) ` +
      `ON CONFLICT (id) DO NOTHING;\n`;
  }
}

// Auth DB user profiles
out += `\n-- =============================================================================\n`;
out += `-- AUTH SERVICE & USER PROFILES\n`;
out += `-- =============================================================================\n`;
out += `\\c auth_db;\n\n`;

for (let i = 1; i <= 50; i++) {
  out += `INSERT INTO user_profiles (id, keycloak_sub, email, first_name, last_name, phone_number, role, business_type, is_email_verified, created_at, updated_at) ` +
    `VALUES ('usr_hotel_${i}', 'sub_hotel_owner_${i}', 'hotel_owner_${i}@blueceylon.lk', 'HotelOwner', '${i}', '+94 71 00000${i.toString().padStart(2, '0')}', 'BUSINESS_OWNER', 'HOTEL', true, NOW(), NOW()) ` +
    `ON CONFLICT (email) DO NOTHING;\n`;

  out += `INSERT INTO user_profiles (id, keycloak_sub, email, first_name, last_name, phone_number, role, business_type, is_email_verified, created_at, updated_at) ` +
    `VALUES ('usr_agency_${i}', 'sub_agency_owner_${i}', 'agency_owner_${i}@blueceylon.lk', 'AgencyOwner', '${i}', '+94 72 00000${i.toString().padStart(2, '0')}', 'BUSINESS_OWNER', 'TOUR_AGENCY', true, NOW(), NOW()) ` +
    `ON CONFLICT (email) DO NOTHING;\n`;

  out += `INSERT INTO user_profiles (id, keycloak_sub, email, first_name, last_name, phone_number, role, business_type, is_email_verified, created_at, updated_at) ` +
    `VALUES ('usr_guide_${i}', 'sub_guide_user_${i}', 'guide_user_${i}@blueceylon.lk', 'TourGuide', '${i}', '+94 77 00000${i.toString().padStart(2, '0')}', 'TOUR_GUIDE', NULL, true, NOW(), NOW()) ` +
    `ON CONFLICT (email) DO NOTHING;\n`;
}

// Booking DB sample bookings & inquiries & inventory
out += `\n-- =============================================================================\n`;
out += `-- BOOKING SERVICE, INQUIRIES & INVENTORY LEDGER\n`;
out += `-- =============================================================================\n`;
out += `\\c blueceylon_booking;\n\n`;

for (let i = 1; i <= 30; i++) {
  const bkgId = `bkg_sample_${i}`;
  const ref = `BC-2026-${10000 + i}`;
  const checkIn = `CURRENT_DATE + INTERVAL '${i * 2} days'`;
  const checkOut = `CURRENT_DATE + INTERVAL '${i * 2 + 2} days'`;
  const itemType = i % 2 === 0 ? 'ROOM' : 'DAY_OUT_PACKAGE';
  const itemId = itemType === 'ROOM' ? `rm_${i}_1` : `dop_${i}`;

  out += `INSERT INTO bookings (id, user_id, business_id, item_type, item_id, check_in_date, check_out_date, quantity, guest_count, total_amount, currency, status, payment_method, booking_reference, created_at, updated_at) ` +
    `VALUES ('${bkgId}', 'usr_hotel_${i}', 'htl_${i}', '${itemType}', '${itemId}', ${checkIn}, ${checkOut}, 1, 2, ${120.0 + i * 15}, 'USD', 'CONFIRMED', 'ONLINE_PAYMENT', '${ref}', NOW(), NOW()) ` +
    `ON CONFLICT (id) DO NOTHING;\n`;

  // Inquiries
  const inqId = `inq_${i}`;
  out += `INSERT INTO inquiries (id, customer_id, owner_type, owner_id, tour_package_id, status, initial_message, intended_start_date, traveler_count, created_at, updated_at) ` +
    `VALUES ('${inqId}', 'usr_hotel_${i}', 'TOUR_AGENCY', 'agn_${i}', 'tp_agn_${i}_1', 'NEW', 'Hello, we would love to customize this multi-day tour for 4 travelers next month. Can we include Sigiriya and Ella?', CURRENT_DATE + INTERVAL '${20 + i} days', 4, NOW(), NOW()) ` +
    `ON CONFLICT (id) DO NOTHING;\n`;

  // Inventory Ledger
  out += `INSERT INTO inventory_ledger (item_id, item_type, stay_date, max_capacity, booked_units, held_units, updated_at, version) ` +
    `VALUES ('rm_${i}_1', 'ROOM', CURRENT_DATE + INTERVAL '${i} days', 10, 2, 0, NOW(), 0) ` +
    `ON CONFLICT DO NOTHING;\n`;
}

// Payment DB
out += `\n-- =============================================================================\n`;
out += `-- PAYMENT SERVICE & TRANSACTIONS\n`;
out += `-- =============================================================================\n`;
out += `\\c payment_db;\n\n`;

for (let i = 1; i <= 30; i++) {
  const txnId = `txn_${i}`;
  out += `INSERT INTO payment_transactions (id, booking_id, user_id, amount, currency, status, payment_gateway, gateway_reference_id, created_at) ` +
    `VALUES ('${txnId}', 'bkg_sample_${i}', 'usr_hotel_${i}', ${120.0 + i * 15}, 'USD', 'SUCCESS', 'PAYHERE', 'PAYHERE_REF_${50000 + i}', NOW()) ` +
    `ON CONFLICT (id) DO NOTHING;\n`;
}

fs.writeFileSync(path.join(__dirname, '..', 'db', 'seed-data.sql'), out);
console.log('Successfully updated db/seed-data.sql with exact schema column alignment!');
