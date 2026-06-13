CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE claims (
    id BIGSERIAL PRIMARY KEY,
    claim_number VARCHAR(255) NOT NULL UNIQUE,
    claimant_id BIGINT NOT NULL REFERENCES users(id),
    claim_type VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    incident_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL REFERENCES claims(id),
    file_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP NOT NULL
);

CREATE TABLE claim_history (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL REFERENCES claims(id),
    changed_by_user_id BIGINT NOT NULL REFERENCES users(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    note VARCHAR(2000),
    created_at TIMESTAMP NOT NULL
);
