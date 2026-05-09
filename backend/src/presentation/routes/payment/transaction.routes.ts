import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { TransactionController } from "../../controllers/payment/TransactionController";

export function createTransactionRoutes(
    authMiddleware: AuthMiddleware,
    transactionController: TransactionController
) {

    const router = Router();

    router.get("/client", authMiddleware.verify.bind(authMiddleware), (req, res) => { void transactionController.getClientTransactions(req, res); });

    router.get("/worker", authMiddleware.verify.bind(authMiddleware), (req, res) => { void transactionController.getWorkerTransactions(req, res); });

    router.get("/admin", authMiddleware.verify.bind(authMiddleware), (req, res) => { void transactionController.getAllTransactions(req, res); });

    return router;
}