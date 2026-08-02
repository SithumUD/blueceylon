
### 6. Search & Filtering Endpoints (`catalog-service`)

**Note:** All search endpoints are open to the public and do not require a JWT token.

#### A. Search Businesses (Cards View)
```http
GET /api/v1/catalog/public/search/businesses?type=HOTEL&city=COLOMBO&page=0&size=10
```

#### B. Get Detailed Business Profile
```http
GET /api/v1/catalog/public/search/business/{business_id}
```

#### C. Search Rooms
```http
GET /api/v1/catalog/public/search/rooms?city=COLOMBO&minPrice=10000&maxPrice=50000&page=0&size=10
```

#### D. Search Tours
```http
GET /api/v1/catalog/public/search/tours?city=KANDY&category=ADVENTURE&minPrice=5000&maxPrice=15000&page=0&size=10
```

