import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { WalletController } from "../../controllers/wallet/WalletController";

export function createWalletRoutes(
    authMiddleware: AuthMiddleware,
    walletController: WalletController
) {
    const router = Router();

    router.get(
        "/wallet/balance",
        authMiddleware.verify.bind(authMiddleware),
        walletController.getBalance
    );

    return router;
}
