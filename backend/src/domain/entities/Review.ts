export interface Review {
  reviewId: string;
  serviceId: string;

  clientId: string;
  workerId: string;

  rating: number;
  review?: string;

  createdAt: Date;
  clientName?: string;
}