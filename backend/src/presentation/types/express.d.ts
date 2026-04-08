import { JwtPayload } from "../../shared/types/JwtPayload";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export { }