--- POSTGRESQL - Relation
CREATE TABLE IF NOT EXISTS patients (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
);

--- Check constraint
ALTER TABLE patients ADD CONSTRAINT check_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE patients ADD CONSTRAINT check_phone_format CHECK (phone ~ '^[0-9]{10}$' AND phone IS NOT NULL AND length(phone) <= 15);
ALTER TABLE patients ADD CONSTRAINT check_address_length CHECK (length(address) > 0 AND length(address) <= 255);
ALTER TABLE patients ADD CONSTRAINT check_name_length CHECK (length(name) > 0 AND length(name) <= 255);

CREATE TABLE IF NOT EXISTS physiotherapists (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
);

--- Check constraint
ALTER TABLE physiotherapists ADD CONSTRAINT check_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE physiotherapists ADD CONSTRAINT check_phone_format CHECK (phone ~ '^[0-9]{10}$' AND phone IS NOT NULL AND length(phone) <= 15);
ALTER TABLE physiotherapists ADD CONSTRAINT check_address_length CHECK (length(address) > 0 AND length(address) <= 255);
ALTER TABLE physiotherapists ADD CONSTRAINT check_name_length CHECK (length(name) > 0 AND length(name) <= 255);


CREATE TABLE IF NOT EXISTS appointments (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    physiotherapist_id UUID NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration TINYINT NOT NULL,
    note VARCHAR(500),
);


--- Check constraint
ALTER TABLE appointments ADD CONSTRAINT check_duration CHECK (duration > 0);
ALTER TABLE appointments ADD CONSTRAINT check_appointment_date CHECK (appointment_date >= CURRENT_DATE);
ALTER TABLE appointments ADD CONSTRAINT check_appointment_time CHECK (appointment_time >= CURRENT_TIME);
ALTER TABLE appointments ADD CONSTRAINT check_note_length CHECK (length(note) > 0 AND length(note) <= 500);

-- RELATION
--- 1 patient can have many appointments
ALTER TABLE patients ADD CONSTRAINT fk_patient_id FOREIGN KEY (patient_id) REFERENCES appointments(id);

--- 1 physiotherapist can have many appointments
ALTER TABLE physiotherapists ADD CONSTRAINT fk_physiotherapist_id FOREIGN KEY (physiotherapist_id) REFERENCES appointments(id);

--- 1 appointment can have 1 patient and 1 physiotherapist
ALTER TABLE appointments ADD CONSTRAINT fk_patient_id FOREIGN KEY (patient_id) REFERENCES patients(id);
ALTER TABLE appointments ADD CONSTRAINT fk_physiotherapist_id FOREIGN KEY (physiotherapist_id) REFERENCES physiotherapists(id);

