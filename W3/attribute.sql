
--- POSTGRESQL - Non relation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS appointments (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name VARCHAR(100) NOT NULL,
    physiotherapist_name VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration NUMERIC NOT NULL,
    note VARCHAR(500),
);

--- Check constraint
ALTER TABLE appointments ADD CONSTRAINT check_duration CHECK (duration > 0);
ALTER TABLE appointments ADD CONSTRAINT check_appointment_date CHECK (appointment_date >= CURRENT_DATE);
ALTER TABLE appointments ADD CONSTRAINT check_appointment_time CHECK (appointment_time >= CURRENT_TIME);
ALTER TABLE appointments ADD CONSTRAINT check_note_length CHECK (length(note) > 0 AND length(note) <= 500);
ALTER TABLE appointments ADD CONSTRAINT check_patient_name_length CHECK (length(patient_name) > 0 AND length(patient_name) <= 100);
ALTER TABLE appointments ADD CONSTRAINT check_physiotherapist_name_length CHECK (length(physiotherapist_name) > 0 AND length(physiotherapist_name) <= 100);





