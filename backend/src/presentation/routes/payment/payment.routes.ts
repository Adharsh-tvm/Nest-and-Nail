import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { PaymentController } from "../../controllers/payment/PaymentController";

const router = Router();

export function createPaymentRoutes(
    authMiddleware: AuthMiddleware,
    paymentController: PaymentController
) {

    const router = Router();

    router.post(
        "/payment/create-order",
        authMiddleware.verify.bind(authMiddleware),
        paymentController.createOrder
    );

    router.post(
        "/payment/verify",
        authMiddleware.verify.bind(authMiddleware),
        paymentController.verify
    );

    router.post(
        "/payment/wallet",
        authMiddleware.verify.bind(authMiddleware),
        paymentController.processWalletPayment
    );

    return router;
}