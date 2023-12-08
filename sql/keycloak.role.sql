CREATE DATABASE bitnami_keycloak;

\c bitnami_keycloak;

CREATE USER keycloak WITH PASSWORD 'keycloak';

CREATE SCHEMA IF NOT EXISTS keycloak AUTHORIZATION keycloak;