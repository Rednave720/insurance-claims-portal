ALTER TABLE claims
    DROP CONSTRAINT IF EXISTS claims_status_check;

ALTER TABLE claims
    ADD CONSTRAINT claims_status_check
    CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'APPROVED', 'DENIED', 'CLOSED'));

ALTER TABLE claim_history
    DROP CONSTRAINT IF EXISTS claim_history_previous_status_check;

ALTER TABLE claim_history
    ADD CONSTRAINT claim_history_previous_status_check
    CHECK (previous_status IS NULL OR previous_status IN ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'APPROVED', 'DENIED', 'CLOSED'));

ALTER TABLE claim_history
    DROP CONSTRAINT IF EXISTS claim_history_new_status_check;

ALTER TABLE claim_history
    ADD CONSTRAINT claim_history_new_status_check
    CHECK (new_status IN ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'APPROVED', 'DENIED', 'CLOSED'));
