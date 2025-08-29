## Natural keys for appointments (non‑relation version)

- physiotherapist_name + appointment_date + appointment_time: uniquely identifies a slot for a physiotherapist (prevents double‑booking a physio).
- patient_name + appointment_date + appointment_time: uniquely identifies a slot for a patient (prevents the patient being booked twice at the same time).
- patient_name + physiotherapist_name + appointment_date + appointment_time: stricter composite that uniquely identifies a specific meeting between a patient and a physio at a time.
