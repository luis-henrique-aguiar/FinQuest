import api from '@/services/api';

/**
 * Profile Feature - API Service
 * 
 * Handles all HTTP requests related to user profile management.
 */

export interface UserProfileDTO {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    level: number;
    totalFinPoints: number;
    registrationAt: string;
    role: 'USER' | 'ADMIN';
}

export interface UpdateProfileDTO {
    name?: string;
    avatarUrl?: string;
}

/**
 * Fetch user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfileDTO> => {
    const response = await api.get<UserProfileDTO>(`/users/${userId}`);
    return response.data;
};

/**
 * Update user avatar
 */
export const updateUserAvatar = async (avatarUrl: string): Promise<UserProfileDTO> => {
    const response = await api.patch<UserProfileDTO>('/users/avatar', { avatarUrl });
    return response.data;
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (updates: UpdateProfileDTO): Promise<UserProfileDTO> => {
    const response = await api.patch<UserProfileDTO>('/users/profile', updates);
    return response.data;
};

/**
 * Update user email
 */
export const updateUserEmail = async (email: string): Promise<void> => {
    await api.put('/users/email', { email });
};
