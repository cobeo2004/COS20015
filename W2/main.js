const db = require("./db.json");

function getAllAppointments() {
  return db.appointments;
}

function getAllPatients() {
  return db.patients;
}
function getAllPhysiotherapists() {
  return db.physiotherapists;
}

/**
 *
 * @param {Date} date
 */
function getAllPatientsThatHasApppointmentsInACertainDate(date) {
  const appointments = getAllAppointments();
  const patients = getAllPatients();

  return patients.filter((patient) =>
    appointments.some(
      (appointment) =>
        appointment.patient_id === patient.id &&
        appointment.appointment_date.split("T")[0] ===
          date.toISOString().split("T")[0]
    )
  );
}

function getAllAppointmentsWithPhysiotherapistBruno() {
  const appointments = getAllAppointments();
  const physiotherapists = getAllPhysiotherapists().filter(
    (physiotherapist) => physiotherapist.name === "Bruno"
  )[0];

  const appointmentsWithPhysiotherapistBruno = appointments.filter(
    (appointment) => physiotherapists.id === appointment.physiotherapist_id
  );

  return appointmentsWithPhysiotherapistBruno;
}

// console.log(getAllAppointmentsWithPhysiotherapistBruno());
console.log(
  getAllPatientsThatHasApppointmentsInACertainDate(new Date("2023-04-18"))
);
