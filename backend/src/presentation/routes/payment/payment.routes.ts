import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { PaymentController } from "../../controllers/payment/PaymentController";

export function createPaymentRoutes(
    authMiddleware: AuthMiddleware,
    paymentController: PaymentController
) {

    const router = Router();

    router.post(
        "/payment/create-order",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void paymentController.createOrder(req, res); }
    );

    router.post(
        "/payment/verify",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void paymentController.verify(req, res); }
    );

    router.post(
        "/payment/wallet",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void paymentController.processWalletPayment(req, res); }
    );

    return router;
}