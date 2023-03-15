export interface IWilder {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  notes: INote[];
}

export interface INote {
  id: string;
  note: number;
  language: ILanguage;
  wilder: IWilder;
}

export interface ILanguage {
  id: string;
  label: string;
}
