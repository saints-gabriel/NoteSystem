export const ROLES = Object.freeze({
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
});

export const STAFF_ROLES = Object.freeze([ROLES.ADMIN, ROLES.TEACHER]);
export const ADMIN_ONLY = Object.freeze([ROLES.ADMIN]);
