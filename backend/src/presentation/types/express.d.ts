import { JwtPayload } from "../../application/types/JwtPayload";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export { }