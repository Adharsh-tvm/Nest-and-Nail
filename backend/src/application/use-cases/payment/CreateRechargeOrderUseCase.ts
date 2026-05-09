import { IPaymentGateway } from "../../../domain/gateways/IPaymentGateway";
import { ICreateRechargeOrderUseCase } from "../../interfaces/payment/ICreateRechargeOrderUseCase";

export class CreateRechargeOrderUseCase implements ICreateRechargeOrderUseCase {
    constructor(private paymentGateway: IPaymentGateway) {}

    async execute(amount: number, userId: string) {
        void userId;
        if (amount <= 0) throw new Error("Amount must be greater than zero");
        
        const order = await this.paymentGateway.createOrder(amount);
        return order;
    }
}
