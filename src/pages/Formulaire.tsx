import { INoteData, IWilder } from "../components/components";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom"; //hook permettant de gérer la navigation depuis react router dom

import { IMessageWithSuccess, InitialWilder } from "./pages.d";
import AssignNote from "../components/AssignNote";

function Formulaire(): JSX.Element {
  const navigate: NavigateFunction = useNavigate(); //récupération de la méthode de navigation depuis useNavigate
  const [searchparams]: [URLSearchParams, Function] = useSearchParams();

  const initialState: InitialWilder = useMemo(
    // le type InitialWilder est comme IWilder mais sans les notes et avec l'id  null (voir le fichier de définition)
    //on déclare un état "state" qui contient un objet
    () => ({ id: null, first_name: "", last_name: "", email: "" }),
    []
  );
  const [state, setState] = useState<InitialWilder | IWilder>(initialState);
  const [notes, setNotes] = useState<INoteData[]>([]);
  const [file, setFile] = useState<File>();
  //au changement de chaque input je vais récupérer le name depuis l'évènement, pour pouvoir atteindre dynamiquement la clé de l'objet "state"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((state) => ({ ...state, [e.target.name]: e.target.value })); //setState((state) => ({...state, first_name: e.target.value }))
    //au dessus on récupère le state dans le dernier état connu car setState, étant asynchrone, il est préférable de forcer la récupération du dernier état pour travailler avec.
  };
  //méthode appelée lors du submit du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); //on stope le comportement par défaut du formulaire à partir de l'évènement du submit, pour éviter de rafraichir la page et nous permettre de travailler de manière programmée les données
    const formData = new FormData();
    formData.append("first_name", state.first_name);
    formData.append("last_name", state.last_name);
    formData.append("email", state.email);
    formData.append("notes", JSON.stringify(notes));
    formData.append("avatar", file as Blob);

    const createOrEditWilder = async (): Promise<void> => {
      try {
        let response: Response = await fetch(
          state.id
            ? `${process.env.REACT_APP_BACK_URL}/wilder/update/${state.id}`
            : `${process.env.REACT_APP_BACK_URL}/wilder/create`,
          {
            method: state.id ? "PATCH" : "POST", //ne pas oublier le post ici puisque par défaut fetch est en GET
            // headers: {
            //   "Content-Type": "application/json", //permet d'indiquer dans la requête que nous envoyons du json
            // },
            body: formData,
            // body: JSON.stringify({ ...state, notes }), //le body doit être en chaine de caractère pour fetch, d'où le JSON.stringify()
          }
        );
        await response.json(); //on attend le traitement json de la réponse.
        navigate("/"); //on basculer sur l'accueil si tout s'est bien passé
      } catch (err) {
        console.log("une erreur s'est produite");
      }
    };
    createOrEditWilder();
  };

  const addNote = () => {
    let note = {} as INoteData;
    setNotes([...notes, note]);
  };

  const getWilder = useCallback(
    async (id: string): Promise<void> => {
      let response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/wilder/find/${id}`
      );
      const result: IWilder | IMessageWithSuccess = await response.json();
      if (response.status !== 200 && "success" in result && !result.success) {
        // le "success" in result permet de savoir si je suis dans le cas d'un IMessageWithSuccess ou non, puisque "result" peut être de type IWilder ou IMessageWithSuccess
        //pensez à regarder l'opérateur "in" ici : https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
        return navigate("/errors/404");
      }
      let wilder = result as IWilder; //puisque "result" peut être de type IWilder ou ImessageWithSuccess
      console.log("%c⧭", "color: #ffcc00", wilder);
      setState(wilder);
      setNotes(wilder.notes);
    },
    [navigate]
  );

  const changeNote = (notes: INoteData[]) => {
    setNotes(notes);
  };
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const id: string | null = searchparams.get("id");
    if (id) {
      getWilder(id); // lorsque le param id est défini, on va récupérer le wilder
    } else {
      setState(initialState); //remet le wilder à l'état initial si je me retrouve dans l'ajout
      setNotes([]);
    }
  }, [searchparams, getWilder, initialState]);

  return (
    <div>
      <h1>{state.id ? "Editer un wilder" : "Ajouter un wilder"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={state.first_name}
          name="first_name"
          placeholder="Firstname"
        />
        <input
          onChange={handleChange}
          value={state.last_name}
          name="last_name"
          placeholder="Lastname"
        />
        <input
          onChange={handleChange}
          value={state.email}
          name="email"
          placeholder="Email"
        />
        <AssignNote notes={notes} addNote={addNote} changeNote={changeNote} />
        <input type="file" name="avatar" onChange={handleChangeFile} />
        <button>Valider</button>
      </form>
    </div>
  );
}
export default Formulaire;
