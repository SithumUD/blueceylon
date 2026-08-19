-- Create users
CREATE USER keycloak_user WITH PASSWORD 'keycloak_pass';
CREATE USER catalog_user WITH PASSWORD 'catalog_pass';
CREATE USER booking_user WITH PASSWORD 'booking_pass';
CREATE USER payment_user WITH PASSWORD 'payment_pass';
CREATE USER auth_user WITH PASSWORD 'auth_pass';

-- Create databases
CREATE DATABASE keycloak_db;
CREATE DATABASE catalog_db;
CREATE DATABASE booking_db;
CREATE DATABASE blueceylon_booking;
CREATE DATABASE payment_db;
CREATE DATABASE auth_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak_user;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO catalog_user;
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;
GRANT ALL PRIVILEGES ON DATABASE blueceylon_booking TO booking_user;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;

-- Postgres 15+ requires explicit schema grants
\c keycloak_db
GRANT ALL ON SCHEMA public TO keycloak_user;
\c catalog_db
GRANT ALL ON SCHEMA public TO catalog_user;
\c booking_db
GRANT ALL ON SCHEMA public TO booking_user;
\c blueceylon_booking
GRANT ALL ON SCHEMA public TO booking_user;
\c payment_db
GRANT ALL ON SCHEMA public TO payment_user;
\c auth_db
GRANT ALL ON SCHEMA public TO auth_user;

