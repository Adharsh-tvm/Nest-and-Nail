import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IStartServiceUseCase } from "../../interfaces/service/IStartServiceUseCase";
import { ServiceStatus } from "../../../shared/enums/serviceEnums";
import { ServiceMapper } from "../../mappers/ServiceMapper";

import { ISendNotificationUseCase } from "../../interfaces/notifications/ISendNotificationUseCase";

export class StartServiceUseCase implements IStartServiceUseCase {

    constructor(
        private readonly _serviceRepo: IServiceRepository,
        private readonly _sendNotification: ISendNotificationUseCase
    ) { }

    async execute(
        serviceId: string,
        workerId: string,
        lat: number,
        lng: number
    ) {

        const service = await this._serviceRepo.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        // Authorization
        if (service.workerId !== workerId) {
            throw new Error("Unauthorized");
        }

        // Status validation
        if (service.status !== ServiceStatus.CONFIRMED) {
            throw new Error("Service cannot be started");
        }

        const now = new Date();
        const scheduled = new Date(service.scheduledDate);

        const diffInMinutes = (now.getTime() - scheduled.getTime()) / (1000 * 60);
        void diffInMinutes;

        // if (diffInMinutes < -30) {
        //     throw new Error("Too early to start service");
        // }

        const [serviceLng, serviceLat] = service.location.coordinates;

        const distance = this.calculateDistance(
            lat,
            lng,
            serviceLat,
            serviceLng
        );
        void distance;

        // if (distance > 150) {
        //     throw new Error("You are not near the service location");
        // }

        const updated = await this._serviceRepo.updateStatus(serviceId, {
            status: ServiceStatus.IN_PROGRESS,
            startedAt: new Date(),
            updatedAt: new Date()
        });

        if (!updated) {
            throw new Error("Failed to start service");
        }

        //  Send Notification
        try {
            await this._sendNotification.execute({
                userId: service.clientId,
                title: "Service Started",
                message: `Your service (ID: ${serviceId}) has been started by the worker.`,
                type: "SERVICE_STARTED",
                data: { serviceId }
            });
        } catch (notifErr) {
            console.error("Failed to send start service notification:", notifErr);
        }

        return ServiceMapper.toResponse(updated);
    }

    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371000; // meters

        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private toRad(value: number): number {
        return (value * Math.PI) / 180;
    }
}