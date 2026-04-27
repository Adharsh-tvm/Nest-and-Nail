import { transactionSource, transactionStatus, transactionType } from "../../shared/enums/transactionEnums"

export interface Transaction {
    transactionId: string,
    walletId: string,
    userId: string,

    type: transactionType
    amount: number

    source: transactionSource

    serviceId?: string

    status: transactionStatus,

    createdAt: Date
}