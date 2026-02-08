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

export interface Achievement {
    achievementId: number;
    title: string;
    icon: string;
    unlockedDate: string;
}

export interface User {
    uid: string;
    name: string;
    email: string | null;
    registrationAt: string;
    avatarUrl: string | null;
    totalFinPoints: number;
    level: number;
    role: 'USER' | 'ADMIN';
    unlockedAchievements: Achievement[];
}
