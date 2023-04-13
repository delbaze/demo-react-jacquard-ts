import { useState } from "react";
import { IAssignNote, ILanguage, INoteData } from "./components.d";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LIST_LANGUAGES } from "../graphql/queries/languages.query";

function AssignNote({ notes, addNote, changeNote }: IAssignNote): JSX.Element {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { data } = useQuery(LIST_LANGUAGES);

  const getFilteredLanguages = (note: INoteData) => {
    let listLanguages = [...data?.languageList].filter(
      (l) => !selectedLanguages.includes(l.id)
    );
    if (Object.keys(note).length) {
      listLanguages.push(note.language); //listLanguages est une copie de languages qui est un tableau de ILanguage.
      //note.language est de type ILanguage
    }
    return listLanguages;
  };

  const handleSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    noteIndex: number
  ) => {
    let oldNotes: INoteData[] = [...notes];
    let note = oldNotes[noteIndex];
    let previousLanguageId = note?.language?.id;

    let oldLanguagesSelected = [...selectedLanguages].filter(
      (sl) => sl != previousLanguageId
    );
    let language: ILanguage | undefined = data?.languageList.find(
      (l: any) => l.id === e.target.value
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
    //aller chercher la note existante dans le tableau  de notes
    //ensuite je devrais modifier la note dans ce tableau pour y mettre la valeur de l'input
    let oldNotes: INoteData[] = [...notes]; // les états ne peuvent pas être modifiés directement, donc je fais un deep clone du tableau
    oldNotes[noteIndex].note = +e.target.value;
    changeNote(oldNotes);
  };

  return (
    <div>
      <button
        type="button"
        disabled={notes.length === data?.languageList?.length}
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
              value={n.note || ""}
            />
            <select
              onChange={(e) => handleSelect(e, index)}
              value={n.language?.id}
              // value={getFilteredLanguages(n)[0].label}
            >
              <option></option>
              {/* {languages.map((l, index) => ( */}
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
