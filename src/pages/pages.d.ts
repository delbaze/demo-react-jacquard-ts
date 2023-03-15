export interface IMessageWithSuccess {
  success: boolean;
  message: string;
}

export interface InitialWilder extends Omit<IWilder, "notes"> {
  id: null;
}
