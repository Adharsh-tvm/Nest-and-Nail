export type ServiceStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type ServiceRequest = {
    id: string;
    title: string;
    description: string;
    category: string;
    status: ServiceStatus;
    images?: string[];
    createdAt: string;
};
