import { INoteData, IWilder } from "../components/components";

import { useEffect, useMemo, useState, useCallback } from "react";

import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom"; //hook permettant de gérer la navigation depuis react router dom

import { InitialWilder } from "./pages.d";
import AssignNote from "../components/AssignNote";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_WILDER,
  UPDATE_WILDER,
} from "../graphql/mutations/wilders.mutation";
import { FIND_WILDER } from "../graphql/queries/wilders.query";

function Formulaire(): JSX.Element {
  const navigate: NavigateFunction = useNavigate(); //récupération de la méthode de navigation depuis useNavigate

  const [searchparams]: [URLSearchParams, Function] = useSearchParams();

  const [addWilder] = useMutation(CREATE_WILDER, {
    onError(error) {
      console.log("ERROR", error);
    },
    onCompleted(data) {
      console.log("DATA", data);
    },
  });

  const [updateWilder] = useMutation(UPDATE_WILDER);

  const [findWilder] = useLazyQuery(FIND_WILDER);
  const initialState: InitialWilder = useMemo(
    // le type InitialWilder est comme IWilder mais sans les notes et avec l'id  null (voir le fichier de définition)
    //on déclare un état "state" qui contient un objet
    () => ({ id: null, first_name: "", last_name: "", email: "" }),
    []
  );
  const [state, setState] = useState<InitialWilder | IWilder>(initialState);
  const [notes, setNotes] = useState<INoteData[]>([]);
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState<string>("/default.png"); //image par défaut stockée dans le dossier public
  const [draggingOver, setDraggingOver] = useState<boolean>(false);
  //lorsque le nom de l'image stocké en back sera sauvegardé en base, il faudra penser à modifier le "filePreview" avec l'url correspondant à l'image du wilder et non celle par défaut
  //au changement de chaque input je vais récupérer le name depuis l'évènement, pour pouvoir atteindre dynamiquement la clé de l'objet "state"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((state) => ({ ...state, [e.target.name]: e.target.value })); //setState((state) => ({...state, first_name: e.target.value }))
    //au dessus on récupère le state dans le dernier état connu car setState, étant asynchrone, il est préférable de forcer la récupération du dernier état pour travailler avec.
  };
  //méthode appelée lors du submit du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); //on stope le comportement par défaut du formulaire à partir de l'évènement du submit, pour éviter de rafraichir la page et nous permettre de travailler de manière programmée les données
    const createOrEditWilder = async (): Promise<void> => {
      try {
        state.id
          ? updateWilder({
              variables: {
                updateWilder: {
                  id: state.id,
                  email: state.email,
                  first_name: state.first_name,
                  last_name: state.last_name,
                  notes,
                  // avatar: state.avatar,
                },
              },
            })
          : addWilder({
              variables: {
                wilderCreate: {
                  email: state.email,
                  first_name: state.first_name,
                  last_name: state.last_name,
                  notes,
                },
              },
            });
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
      findWilder({
        onCompleted(data) {
          const { findWilder: wilder } = data;
          setState(wilder);
          setNotes(wilder.notes);
        },
        variables: {
          findWilderId: id,
        },
      });
    },
    [navigate]
  );

  const changeNote = (notes: INoteData[]) => {
    setNotes(notes);
  };
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      let file = e.target.files[0];
      setFile(file);
      let objectURL = URL.createObjectURL(file);
      setFilePreview(objectURL);
    }
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOver(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let file = e.dataTransfer.files[0];
    let objectURL = URL.createObjectURL(file);
    setFilePreview(objectURL);
    setDraggingOver(false);
    setFile(file);
    e.dataTransfer.clearData();
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
    <div className="container">
      <h1>{state.id ? "Editer un wilder" : "Ajouter un wilder"}</h1>
      <form onSubmit={handleSubmit} className="form">
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
        <div
          className={`fileBloc ${draggingOver ? "draggingOver" : ""}`}
          draggable={true}
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={(e) => handleDragLeave(e)}
        >
          <label className="dropArea" htmlFor="avatar">
            <div className="instructions">
              Glissez un fichier ici ou cliquez
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleChangeFile}
              hidden
            />
          </label>
          <img className="preview" src={filePreview} />
        </div>

        <button>Valider</button>
      </form>
    </div>
  );
}
export default Formulaire;
