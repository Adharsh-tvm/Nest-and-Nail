import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { WalletController } from "../../controllers/wallet/WalletController";

export function createWalletRoutes(
    authMiddleware: AuthMiddleware,
    walletController: WalletController
) {
    const router = Router();

    router.get(
        "/balance",
        authMiddleware.verify.bind(authMiddleware),
        (req, res) => { void walletController.getBalance(req, res); }
    );

    router.get(
        "/admin/:userId/balance",
        authMiddleware.adminOnly.bind(authMiddleware),
        (req, res) => { void walletController.getBalanceByUserId(req, res); }
    );

    router.get("/transactions", authMiddleware.verify.bind(authMiddleware), (req, res) => { void walletController.getTransactions(req, res); });

    router.post("/recharge/create-order", authMiddleware.verify.bind(authMiddleware), (req, res) => { void walletController.createRechargeOrder(req, res); });
    router.post("/recharge/verify", authMiddleware.verify.bind(authMiddleware), (req, res) => { void walletController.verifyRechargePayment(req, res); });

    return router;
}
