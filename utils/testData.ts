export const ORBIT_USERS = {
  admin: {
    username: process.env.ORBIT_ADMIN_USER || 'admin',
    password: process.env.ORBIT_ADMIN_PASSWORD || 'admin123',
    role: 'ADMIN',
    fullName: 'System Admin',
  },
  member: {
    username: process.env.ORBIT_MEMBER_USER || 'alex',
    password: process.env.ORBIT_MEMBER_PASSWORD || 'alex123',
    role: 'MEMBER',
    fullName: 'Alex Chen',
  },
  viewer: {
    username: process.env.ORBIT_VIEWER_USER || 'sam',
    password: process.env.ORBIT_VIEWER_PASSWORD || 'sam123',
    role: 'VIEWER',
    fullName: 'Sam Taylor',
  },
  invalid: {
    username: 'invalid_orbit_user',
    password: 'wrong_password',
  },
};

export const ORBIT_PROJECTS = {
  core: {
    id: 'proj-proj',
    key: 'PROJ',
    name: 'Core Platform',
  },
  mobile: {
    id: 'proj-mobile',
    key: 'MOBILE',
    name: 'Mobile Experience',
  },
};

export const credentials = {
  validUser: {
    username: ORBIT_USERS.admin.username,
    password: ORBIT_USERS.admin.password,
  },
  admin: ORBIT_USERS.admin,
  member: ORBIT_USERS.member,
  viewer: ORBIT_USERS.viewer,
  invalidUser: ORBIT_USERS.invalid,
  username: ORBIT_USERS.admin.username,
  password: ORBIT_USERS.admin.password,
};