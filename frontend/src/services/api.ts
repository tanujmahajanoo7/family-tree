import type { AuthResponse, LoginRequest, Person, Relationship, SignupRequest } from '../types';

const BASE_URL = 'http://localhost:8080/api';

// Helper to get token
const getToken = (): string | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user: AuthResponse = JSON.parse(userStr);
            return user.token;
        } catch (e) {
            return null;
        }
    }
    return null;
};

// Generic request wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (e.g. DELETE)
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
}

export const authService = {
    login: (data: LoginRequest) => request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    register: (data: SignupRequest) => request<{ message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

export const personService = {
    getAll: () => request<Person[]>('/person'),
    getById: (id: number) => request<Person>(`/person/${id}`),
    create: (person: Person) => request<Person>('/person', {
        method: 'POST',
        body: JSON.stringify(person),
    }),
    update: (id: number, person: Person) => request<Person>(`/person/${id}`, {
        method: 'PUT',
        body: JSON.stringify(person),
    }),
    delete: (id: number) => request<void>(`/person/${id}`, {
        method: 'DELETE',
    }),
    uploadImage: async (formData: FormData) => {
        // Special handling for FormData (no Content-Type header, browser sets it with boundary)
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${BASE_URL}/person/upload`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        return response.text(); // Returns URL or message
    }
};

export const relationshipService = {
    getAll: () => request<Relationship[]>('/relationship'),
    getByPerson: (personId: number) => request<Relationship[]>(`/relationship/person/${personId}`),
    create: (data: Partial<Relationship>) => request<Relationship>('/relationship', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => request<void>(`/relationship/${id}`, {
        method: 'DELETE',
    }),
};

export const adminService = {
    // Note: Endpoint expects nothing? or maybe status? Assuming just activation signal.
    activateUser: (userId: number) => request<void>(`/admin/users/${userId}/activate`, {
        method: 'PUT',
    }),
    getAllUsers: () => request<import('../types').User[]>('/admin/users'),
};

export const roleService = {
    getAll: () => request<any[]>('/roles'),
    createRole: (name: string) => request<any>('/roles', {
        method: 'POST',
        body: JSON.stringify({ name }) // Assuming simple object
    }),
    assignRole: (roleId: number, userId: number) => request<void>(`/roles/${roleId}/users/${userId}`, {
        method: 'POST'
    })
};
