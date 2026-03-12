export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
  usage_type: string;
};

export type ContactRequestPayload = {
  full_name: string;
  email: string;
  specialty: string;
  usage_type: string;
  device_count: string;
  orcid_status: string;
  message: string;
};


export type ContactRequestRecord = {
  id: number;
  full_name: string;
  email: string;
  specialty: string | null;
  usage_type: string;
  device_count: string | null;
  orcid_status: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type LicenseStatus = {
  valid: boolean;
  plan?: string;
  expires_at?: string | null;
  max_devices?: number;
  active_devices?: number;
  features?: string[];
};

export type DeviceRecord = {
  id: number;
  device_uid: string;
  platform: string;
  device_name: string | null;
  last_seen_at: string;
};

async function readError(res: Response, fallback: string) {
  const text = await res.text();
  return text || fallback;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Login failed'));
  }

  return res.json();
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Register failed'));
  }

  return res.json();
}

export async function createContactRequest(payload: ContactRequestPayload) {
  const res = await fetch(`${API_BASE_URL}/contact-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Contact request failed'));
  }

  return res.json();
}


export async function listContactRequests(token: string): Promise<ContactRequestRecord[]> {
  const res = await fetch(`${API_BASE_URL}/contact-requests`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Contact request list failed'));
  }

  return res.json();
}


export async function updateContactRequestStatus(token: string, requestId: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/contact-requests/${requestId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Contact request update failed'));
  }

  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Forgot password failed'));
  }

  return res.json();
}

export async function verifyOrcid(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/orcid/verify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'ORCID verify failed'));
  }

  return res.json();
}

export async function checkLicense(token: string): Promise<LicenseStatus> {
  const res = await fetch(`${API_BASE_URL}/license/check`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'License check failed'));
  }

  return res.json();
}

export async function listDevices(token: string): Promise<DeviceRecord[]> {
  const res = await fetch(`${API_BASE_URL}/devices`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Device list failed'));
  }

  return res.json();
}

export async function deleteDevice(token: string, deviceId: number) {
  const res = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await readError(res, 'Device delete failed'));
  }
}

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Health check failed');
  }

  return res.json();
}
