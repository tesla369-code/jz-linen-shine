export type StoredUser = {
  id: string;
  createdAt: string;
  lastLoginAt?: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type NewUser = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

const USERS_KEY = "jz_users_v1";
const CURRENT_USER_KEY = "jz_current_user_v1";
const ADMIN_FLAG_KEY = "isAdmin";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "JzL!nen#2026$Swindon";

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Local storage is not available");
  }
  return window.localStorage;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = getStorage().getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  getStorage().setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(input: NewUser): StoredUser {
  const email = normalizeEmail(input.email);
  const existing = getUsers().find((user) => normalizeEmail(user.email) === email);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: createId(),
    createdAt: now,
    lastLoginAt: now,
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || undefined,
    password: input.password,
  };

  writeUsers([user, ...getUsers()]);
  setCurrentUser(user);
  return user;
}

export function authenticateUser(identifier: string, password: string): StoredUser | null {
  const normalized = normalizeEmail(identifier);
  const users = getUsers();
  const user = users.find(
    (entry) => normalizeEmail(entry.email) === normalized && entry.password === password,
  );
  if (!user) return null;

  const updated = { ...user, lastLoginAt: new Date().toISOString() };
  writeUsers(users.map((entry) => (entry.id === user.id ? updated : entry)));
  setCurrentUser(updated);
  return updated;
}

export function deleteUser(id: string) {
  writeUsers(getUsers().filter((user) => user.id !== id));
}

export function clearUsers() {
  getStorage().removeItem(USERS_KEY);
  getStorage().removeItem(CURRENT_USER_KEY);
}

export function setCurrentUser(user: StoredUser) {
  getStorage().setItem(
    CURRENT_USER_KEY,
    JSON.stringify({ id: user.id, email: user.email, name: user.name }),
  );
}

export function signOutCurrentUser() {
  getStorage().removeItem(CURRENT_USER_KEY);
}

export function isAdminCredentials(username: string, password: string) {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function setAdminSession() {
  getStorage().setItem(ADMIN_FLAG_KEY, "true");
}

export function clearAdminSession() {
  getStorage().removeItem(ADMIN_FLAG_KEY);
}

export function hasAdminSession() {
  if (typeof window === "undefined") return false;
  try {
    return getStorage().getItem(ADMIN_FLAG_KEY) === "true";
  } catch {
    return false;
  }
}
