import { ControllerDI } from "./controllers.di";
import { InfrastructureDI } from "./infrastructure.di";
import { UseCaseDI } from "./usecases.di";

export class DIContainer {
  public readonly infra = new InfrastructureDI();
  public readonly useCases = new UseCaseDI(this.infra);
  public readonly controllers = new ControllerDI(
    this.useCases,
    this.infra
  )
}