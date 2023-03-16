import { useCallback, useEffect, useState } from "react";
import { IAssignNote, ILanguage, INoteData } from "./components.d";
import { IMessageWithSuccess } from "../pages/pages";
import { useNavigate } from "react-router-dom";

function AssignNote({ notes, addNote, changeNote }: IAssignNote): JSX.Element {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const getLanguages = useCallback(async (): Promise<void> => {
    let response = await fetch(
      `${process.env.REACT_APP_BACK_URL}/language/list`
    );
    const result: ILanguage[] | IMessageWithSuccess = await response.json();
    if (response.status !== 200 && "success" in result && !result.success) {
      return navigate("/errors/500");
    }

    setLanguages(result as ILanguage[]); //puisque "result" peut être de type IWilder ou ImessageWithSuccess
  }, []);

  const getFilteredLanguages = (note: INoteData) => {
    let listLanguages = [...languages].filter(
      (l) => !selectedLanguages.includes(l.id)
    );
    if (Object.keys(note).length) {
      listLanguages.push(note.language);
    }
    return listLanguages;
  };
  const handleSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    noteIndex: number
  ) => {
    let oldNotes: INoteData[] = [...notes];
    let note = oldNotes[noteIndex];
    let oldLanguagesSelected = [...selectedLanguages];
    let language: ILanguage | undefined = languages.find(
      (l) => l.id === e.target.value
    );
    if (language && note) {
      note.language = language;
      let languagesSelectedIndex = selectedLanguages.findIndex(
        (id) => id === language?.id
      );
      if (languagesSelectedIndex === -1) {
        oldLanguagesSelected.push(language?.id);
      } else {
        oldLanguagesSelected = oldLanguagesSelected.filter(
          (id) => id !== language?.id
        );
      }
    }
    changeNote(oldNotes);
    setSelectedLanguages(oldLanguagesSelected);
  };
  const handleChangeNote = (
    e: React.ChangeEvent<HTMLInputElement>,
    noteIndex: number
  ) => {
    let oldNotes: INoteData[] = [...notes];
    oldNotes[noteIndex].note = e.target.value as any as number;
    changeNote(oldNotes);
  };
  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <div>
      <button
        type="button"
        disabled={notes.length === languages.length}
        onClick={addNote}
      >
        Ajouter une note
      </button>
      <ul>
        {notes.map((n, index) => (
          <li key={index}>
            <input
              placeholder="note"
              onChange={(e) => handleChangeNote(e, index)}
              type="number"
              min={0}
              value={n?.note || ""}
            />
            <select
              onChange={(e) => handleSelect(e, index)}
              value={n?.language?.id}
              // value={getFilteredLanguages(n)[0].label}
            >
              <option></option>
              {getFilteredLanguages(n).map((l, index) => (
                <option key={index} value={l?.id}>
                  {l?.label}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssignNote;
