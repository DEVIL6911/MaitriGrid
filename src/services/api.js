import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:8000'; // Android emulator
// const API_BASE_URL = 'http://localhost:8000'; // iOS simulator / Web

const TOKEN_KEY = 'maitrigrid_token';

/**
 * Get the stored auth token.
 */
export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Store the auth token.
 */
export async function setToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save token', e);
  }
}

/**
 * Remove the auth token (logout).
 */
export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove token', e);
  }
}

/**
 * Core fetch wrapper with auth headers.
 */
async function apiFetch(endpoint, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await removeToken();
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong');
  }

  return data;
}

// ─── Auth API ───

export const authAPI = {
  login: (phone, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  signup: (phone, password) =>
    apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  verifyOTP: (phone, otp) =>
    apiFetch('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  forgotPassword: (phone, newPassword) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ phone, new_password: newPassword }),
    }),

  getMe: () => apiFetch('/auth/me'),
};

// ─── User API ───

export const userAPI = {
  getProfile: () => apiFetch('/user'),

  updateProfile: (data) =>
    apiFetch('/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Energy API ───

export const energyAPI = {
  getStats: () => apiFetch('/energy'),
  getHistory: () => apiFetch('/energy-history'),
};

// ─── Marketplace API ───

export const marketplaceAPI = {
  getListings: () => apiFetch('/listings'),

  createListing: (energyKwh, pricePerKwh) =>
    apiFetch('/listings', {
      method: 'POST',
      body: JSON.stringify({ energy_kwh: energyKwh, price_per_kwh: pricePerKwh }),
    }),

  buyEnergy: (listingId) =>
    apiFetch('/buy-energy', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    }),
};

// ─── Transactions API ───

export const transactionsAPI = {
  getAll: () => apiFetch('/transactions'),
};

// ─── Wallet API ───

export const walletAPI = {
  getBalance: () => apiFetch('/wallet'),

  topup: (amount) =>
    apiFetch('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// ─── Solar API ───

export const solarAPI = {
  register: (modelNumber, capacity, meterNumber) =>
    apiFetch('/solar/register', {
      method: 'POST',
      body: JSON.stringify({
        model_number: modelNumber,
        capacity,
        meter_number: meterNumber,
      }),
    }),

  connect: (qrCode) =>
    apiFetch('/solar/connect', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode }),
    }),

  getStatus: () => apiFetch('/solar/status'),
};

// ─── Statistics API ───

export const statisticsAPI = {
  get: () => apiFetch('/statistics'),
};
