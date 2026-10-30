export const ROLES = Object.freeze({
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
});

export const STAFF_ROLES = [ROLES.ADMIN, ROLES.TEACHER];

const HOME_PATHS = {
  [ROLES.ADMIN]: "/dashboard",
  [ROLES.TEACHER]: "/pedagogy-hub",
  [ROLES.STUDENT]: "/student-home",
};

export const homePathFor = (role) => HOME_PATHS[role] ?? "/";
