const fs = require('fs');
const path = require('path');

const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'blueceylon';
const DEFAULT_PASSWORD = 'Password@123';

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

const propertyTypes = ['BOUTIQUE', 'RESORT', 'HOTEL', 'VILLA', 'ECO_LODGE'];
const vehicleTypes = ['SUV', 'VAN', 'CAR', 'TUK_TUK'];
const vehicleModels = ['Toyota Prado 4x4', 'Toyota KDH Super GL Luxury', 'Toyota Prius Hybrid', 'Tuk-Tuk Safari Spec'];

async function getAdminToken() {
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('username', 'admin');
  params.append('password', 'admin');
  params.append('grant_type', 'password');

  const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  if (!res.ok) {
    throw new Error(`Failed to get admin token: ${res.statusText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getAllUsers(token) {
  const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?max=200`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

async function main() {
  console.log('Fetching Keycloak users for Blue Ceylon...');
  const token = await getAdminToken();
  const keycloakUsers = await getAllUsers(token);
  const userMapByEmail = {};
  for (const u of keycloakUsers) {
    userMapByEmail[u.email] = u.id;
  }

  let md = `# Blue Ceylon - Seeded User Credentials & Comprehensive Business Directory\n\n`;
  md += `This document provides the full directory of all **160 seeded user accounts** provisioned in **Keycloak (Realm: \`blueceylon\`)**, synchronized with the **Auth Service Database (\`auth_db\`)**, and mapped to their respective business assets in **Catalog Database (\`catalog_db\`)**.\n\n`;

  md += `> [!NOTE]\n`;
  md += `> - **Global Default Password:** \`Password@123\`\n`;
  md += `> - **Keycloak Realm:** \`blueceylon\`\n`;
  md += `> - **Keycloak Admin URL:** \`http://localhost:8180\`\n`;
  md += `> - **Frontend Application:** \`http://localhost:3000\`\n\n`;

  md += `## Summary Statistics\n\n`;
  md += `| User Category | User Count | Realm Role | Business Type | Rooms / Tours Managed | Reviews & FAQs | Default Password |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  md += `| **Hotel Owners & Managers** | **50** | \`BUSINESS_OWNER\` | \`HOTEL\` | **200 Rooms** (4/hotel) + **100 Tours** (2/hotel) + **100 Day/Night Passes** | **150 Reviews**, **100 FAQs** | \`Password@123\` |\n`;
  md += `| **Tour Agency Operators** | **50** | \`BUSINESS_OWNER\` | \`TOUR_AGENCY\` | **150 Multi-Day Tours** (3/agency, 3–7 day circuits) | **150 Reviews**, **50 FAQs** | \`Password@123\` |\n`;
  md += `| **Licensed Tour Guides** | **50** | \`TOUR_GUIDE\` | \`N/A\` | **100 Private Guided Tours** (2/guide) + **100 Blackout Dates** | **150 Reviews** | \`Password@123\` |\n`;
  md += `| **Travelers & Customers** | **10** | \`TRAVELER\` | \`N/A\` | **30 Active Bookings** + **30 Inquiries** across platform | Verified Reviewers | \`Password@123\` |\n`;
  md += `| **Total Active Platform Users** | **160** | - | - | **550 Total Listings & Passes** | **450 Reviews, 150 FAQs** | - |\n\n`;

  // 1. Hotel Owners
  md += `## 1. Hotel Owners & Managers (50 Users)\n\n`;
  md += `Each hotel owner profile manages **4 distinct room types** (Deluxe King, Presidential Suite, Standard Garden, Private Pool Villa), **2 curated hotel tour packages**, **1 Day Out Luxury Pass**, **1 Night Out Seafood BBQ Pass**, **24 master amenities**, and **verified customer reviews**.\n\n`;
  md += `| # | Hotel / Property Name | Location & Region | Property Type | Managed Inventory | Username / Email | Password | Role | Keycloak Sub UUID |\n`;
  md += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (let i = 0; i < 50; i++) {
    const hotelName = hotelNames[i];
    const city = cities[i % cities.length];
    const region = cityRegions[city];
    const pType = propertyTypes[i % propertyTypes.length];
    const email = `hotel_owner_${i + 1}@blueceylon.lk`;
    const sub = userMapByEmail[email] || `keycloak-uuid-hotel-${i + 1}`;
    const totalUnits = 10 + i * 2;
    const inventorySummary = `4 Room Types (${totalUnits} units), 2 Tours, 1 Day Out, 1 Night Out`;

    md += `| ${i + 1} | **${hotelName}** | ${city} (${region}) | \`${pType}\` | ${inventorySummary} | \`${email}\` | \`${DEFAULT_PASSWORD}\` | \`BUSINESS_OWNER\` | \`${sub}\` |\n`;
  }

  // 2. Tour Agency Owners
  md += `\n## 2. Tour Agency Operators (50 Users)\n\n`;
  md += `Each tour agency manages **3 multi-day guided tour circuits** (7-Day Cultural Triangle & Yala Safari, 3-Day Hill Country Scenic Train, 5-Day Southern Coastline & Whales), dedicated fleets (` + '`SUV` / `VAN` / `COACH`' + `), specializations, and partner networks.\n\n`;
  md += `| # | Tour Agency Name | Base City | Fleet & Specialization | Managed Tour Circuits | Username / Email | Password | Role | Keycloak Sub UUID |\n`;
  md += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (let i = 0; i < 50; i++) {
    const agencyName = agencyNames[i];
    const city = cities[i % cities.length];
    const email = `agency_owner_${i + 1}@blueceylon.lk`;
    const sub = userMapByEmail[email] || `keycloak-uuid-agency-${i + 1}`;
    const fleetInfo = `SUV / VAN / COACH (Special: Safari, Culture, Trekking)`;
    const circuits = `3 Multi-Day Tours (3-Day, 5-Day, 7-Day)`;

    md += `| ${i + 1} | **${agencyName}** | ${city} | ${fleetInfo} | ${circuits} | \`${email}\` | \`${DEFAULT_PASSWORD}\` | \`BUSINESS_OWNER\` | \`${sub}\` |\n`;
  }

  // 3. Tour Guides
  md += `\n## 3. Licensed Tour Guides (50 Users)\n\n`;
  md += `Each tour guide profile includes verified SLTDA license numbers, language fluencies (` + 'English, German, French, Sinhala' + `), dedicated vehicle transport, daily rates, calendar blackout dates, and **2 private tour packages**.\n\n`;
  md += `| # | Tour Guide Name | Operating City | Languages & Vehicle | Rates & Experience | Managed Private Tours | Username / Email | Password | Role | Keycloak Sub UUID |\n`;
  md += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (let i = 0; i < 50; i++) {
    const guideName = guideNames[i];
    const city = cities[i % cities.length];
    const email = `guide_user_${i + 1}@blueceylon.lk`;
    const sub = userMapByEmail[email] || `keycloak-uuid-guide-${i + 1}`;
    const vModel = vehicleModels[i % vehicleModels.length];
    const lang = i % 2 === 0 ? "English, German, Sinhala" : "English, French, Sinhala";
    const rate = `$${55 + (i % 6) * 15}/day ($${35 + (i % 6) * 10}/half-day)`;
    const exp = `${4 + (i % 18)} yrs exp`;
    const tours = `2 Private Tours (Secret Waterfall & Village Life)`;

    md += `| ${i + 1} | **${guideName}** | ${city} | ${lang} • ${vModel} | ${rate} • ${exp} | ${tours} | \`${email}\` | \`${DEFAULT_PASSWORD}\` | \`TOUR_GUIDE\` | \`${sub}\` |\n`;
  }

  // 4. Travelers & Customers
  md += `\n## 4. Travelers & Customers (10 Sample Accounts)\n\n`;
  md += `These verified customer accounts can be used to test bookings, shopping cart checkouts, inquiry submissions, and leaving reviews.\n\n`;
  md += `| # | Customer Name | Country | Activity Summary | Username / Email | Password | Role | Keycloak Sub UUID |\n`;
  md += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  const travelerNames = [
    ["Emma Watson", "United Kingdom"],
    ["Alexander Schmidt", "Germany"],
    ["Sophie Dubois", "France"],
    ["Lucas Rossi", "Italy"],
    ["Oliver Brown", "Australia"],
    ["Liam Taylor", "Canada"],
    ["Elena Petrova", "Switzerland"],
    ["David Miller", "United States"],
    ["Mia Tanaka", "Japan"],
    ["Noah Van Der Berg", "Netherlands"]
  ];

  for (let i = 0; i < 10; i++) {
    const [name, country] = travelerNames[i];
    const email = `traveler_${i + 1}@blueceylon.lk`;
    const sub = userMapByEmail[email] || `keycloak-uuid-traveler-${i + 1}`;
    const activity = `Active Bookings, Verified Reviews & Custom Inquiries`;

    md += `| ${i + 1} | **${name}** | ${country} | ${activity} | \`${email}\` | \`${DEFAULT_PASSWORD}\` | \`TRAVELER\` | \`${sub}\` |\n`;
  }

  fs.writeFileSync(path.join(__dirname, '..', 'SEEDED_USERS_CREDENTIALS.md'), md);
  console.log('Successfully updated SEEDED_USERS_CREDENTIALS.md with comprehensive asset summaries!');
}

main().catch(err => {
  console.error('Error generating document:', err);
});
