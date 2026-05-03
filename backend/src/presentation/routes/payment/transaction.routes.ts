import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { PaymentController } from "../../controllers/payment/PaymentController";
import { TransactionController } from "../../controllers/payment/TransactionController";

export function createTransactionRoutes(
    authMiddleware: AuthMiddleware,
    transactionController: TransactionController
) {

    const router = Router();

    router.get("/client", authMiddleware.verify.bind(authMiddleware), transactionController.getClientTransactions.bind(transactionController));

    router.get("/worker", authMiddleware.verify.bind(authMiddleware), transactionController.getWorkerTransactions.bind(transactionController));

    router.get("/admin", authMiddleware.verify.bind(authMiddleware), transactionController.getAllTransactions.bind(transactionController));

    return router;
}