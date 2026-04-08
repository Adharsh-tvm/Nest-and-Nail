export interface IGenerateUserID {
  create(): Promise<string>;
}
