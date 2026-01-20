export interface Address {
    label: "HOME" | "WORK" | "OTHER";
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;

    location: {
        type: "Point";
        coordinates: [number, number];
    };

    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}