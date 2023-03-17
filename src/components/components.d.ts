export interface IWilder {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  notes: INote[];
  avatar?: string | null;
}

export interface INote {
  id: string;
  note: number;
  language: ILanguage;
  wilder: IWilder;
}
export interface INoteData extends Omit<INote, "wilder"> {}
export interface ILanguage {
  id: string;
  label: string;
}

export interface IAssignNote {
  notes: INoteData[];
  addNote: React.MouseEventHandler<HTMLButtonElement>;
  changeNote: Function
}
