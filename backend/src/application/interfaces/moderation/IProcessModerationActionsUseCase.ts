import { ProcessModerationResultDTO } from "../../dtos/ModerationDTO";

export interface IProcessModerationActionsUseCase {
  execute(): Promise<ProcessModerationResultDTO>;
}
