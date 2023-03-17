export interface IMessageWithSuccess {
  success: boolean;
  message: string;
}

export interface InitialWilder extends Omit<IWilder, "notes"> {
  id: null;
}

export interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
  dataTransfer: DataTransfer;
}