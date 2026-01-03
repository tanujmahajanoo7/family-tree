export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    active?: boolean;
}

export interface AuthResponse {
    token: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Person {
    id?: number; // Optional for creation
    fullName: string;
    gender: Gender;
    dateOfBirth?: string; // ISO Date "YYYY-MM-DD"
    dateOfDeath?: string;
    isAlive: boolean;
    imageUrl?: string;
    contactNumber?: string;
    email?: string;
    father?: Person; // Recursive structure could be tricky, might just be IDs in forms
    mother?: Person;
    fatherId?: number; // Helper for forms
    motherId?: number; // Helper for forms
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type RelationshipType = 'MARRIED' | 'DIVORCED' | 'PARTNER';

export interface Relationship {
    id?: number;
    person1: Person;
    person2: Person;
    relationshipType: RelationshipType;
    startDate?: string;
    endDate?: string;
    person1Id?: number; // Helper for forms
    person2Id?: number; // Helper for forms
}

// Request Types
export interface LoginRequest {
    username?: string;
    password?: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    role?: string;
}
