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
        walletController.getBalance
    );

    router.get("/transactions", authMiddleware.verify.bind(authMiddleware), walletController.getTransactions);

    return router;
}
