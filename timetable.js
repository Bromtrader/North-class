/**
 * ============================================================
 * NORTH CLASS — TIMETABLE
 * ============================================================
 * "days" controls which columns appear, in order.
 * "periods" is a flat list of lessons — add one object per lesson.
 * The lesson happening right now is highlighted automatically,
 * based on the visitor's device clock.
 *
 * See README.md → "8. Update the Timetable" for a full walkthrough.
 *
 * FIELD GUIDE (each item inside "periods")
 * ------------------------------------------------------------
 * day       required   must exactly match one entry in "days" below
 * subject   required
 * teacher   optional
 * room      optional
 * start     required   24-hour "HH:MM", e.g. "08:00"
 * end       required   24-hour "HH:MM", e.g. "08:40"
 * ------------------------------------------------------------
 *
 * EXAMPLE:
 *
 * { day: "Monday", subject: "Mathematics", teacher: "Mr. Bello",
 *   room: "Room 4", start: "08:00", end: "08:40" },
 */

const TIMETABLE = {

  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

  periods: [

  ]

};
