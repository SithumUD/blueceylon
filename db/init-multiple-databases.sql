-- Create users
CREATE USER keycloak_user WITH PASSWORD 'keycloak_pass';
CREATE USER catalog_user WITH PASSWORD 'catalog_pass';
CREATE USER booking_user WITH PASSWORD 'booking_pass';
CREATE USER payment_user WITH PASSWORD 'payment_pass';

-- Create databases
CREATE DATABASE keycloak_db;
CREATE DATABASE catalog_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak_user;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO catalog_user;
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;

-- Postgres 15+ requires explicit schema grants
\c keycloak_db
GRANT ALL ON SCHEMA public TO keycloak_user;
\c catalog_db
GRANT ALL ON SCHEMA public TO catalog_user;
\c booking_db
GRANT ALL ON SCHEMA public TO booking_user;
\c payment_db
GRANT ALL ON SCHEMA public TO payment_user;
