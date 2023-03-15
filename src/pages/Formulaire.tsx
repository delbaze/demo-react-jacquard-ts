import { IWilder } from "../components/components";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom"; //hook permettant de gérer la navigation depuis react router dom
import { IMessageWithSuccess, InitialWilder } from "./pages.d";

function Formulaire(): JSX.Element {
  const navigate: NavigateFunction = useNavigate(); //récupération de la méthode de navigation depuis useNavigate
  const [searchparams]: [URLSearchParams, Function] = useSearchParams();
  // const controller: AbortController = new AbortController(); //permettra d'annuler la requête au déchargement du composant
  const controller = useRef(new AbortController());

  const initialState: InitialWilder = useMemo(
    // le type InitialWilder est comme IWilder mais sans les notes et avec l'id  null (voir le fichier de définition)
    //on déclare un état "state" qui contient un objet
    () => ({ id: null, first_name: "", last_name: "", email: "" }),
    []
  );
  const [state, setState] = useState<InitialWilder | IWilder>(initialState);
  //au changement de chaque input je vais récupérer le name depuis l'évènement, pour pouvoir atteindre dynamiquement la clé de l'objet "state"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((state) => ({ ...state, [e.target.name]: e.target.value })); //setState((state) => ({...state, first_name: e.target.value }))
    //au dessus on récupère le state dans le dernier état connu car setState, étant asynchrone, il est préférable de forcer la récupération du dernier état pour travailler avec.
  };
  //méthode appelée lors du submit du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); //on stope le comportement par défaut du formulaire à partir de l'évènement du submit, pour éviter de rafraichir la page et nous permettre de travailler de manière programmée les données
    console.log(
      "TEST",
      `${process.env.REACT_APP_BACK_URL}/wilder/update/${state.id}`
    );
    const createOrEditWilder = async (): Promise<void> => {
      let signal: AbortSignal = controller.current.signal;
      try {
        let response: Response = await fetch(
          state.id
            ? `${process.env.REACT_APP_BACK_URL}/wilder/update/${state.id}`
            : `${process.env.REACT_APP_BACK_URL}/wilder/create`,
          {
            signal, //injection du signal permettant ensuite l'annulation de la requête
            method: state.id ? "PATCH" : "POST", //ne pas oublier le post ici puisque par défaut fetch est en GET
            headers: {
              "Content-Type": "application/json", //permet d'indiquer dans la requête que nous envoyons du json
            },
            body: JSON.stringify(state), //le body doit être en chaine de caractère pour fetch, d'où le JSON.stringify()
          }
        );
        await response.json(); //on attend le traitement json de la réponse.
        navigate("/"); //on basculer sur l'accueil si tout s'est bien passé
        // return redirect('http://localhost:3000')
      } catch (err) {
        console.log("%c⧭", "color: #aa00ff", err);
        console.log("une erreur s'est produite");
      }
    };
    createOrEditWilder();
  };

  const getWilder = useCallback(
    async (id: string): Promise<void> => {
      let response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/wilder/find/${id}`
      );
      const result: IWilder | IMessageWithSuccess = await response.json();
      console.log("%c⧭", "color: #733d00", result);
      if (response.status !== 200 && "success" in result && !result.success) {
        // le "success" in result permet de savoir si je suis dans le cas d'un IMessageWithSuccess ou non, puisque "result" peut être de type IWilder ou IMessageWithSuccess
        //pensez à regarder l'opérateur "in" ici : https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
        return navigate("/errors/404");
      }
      setState(result as IWilder); //puisque "result" peut être de type IWilder ou ImessageWithSuccess
    },
    [navigate]
  );
  useEffect(() => {
    const control = controller.current;
    return () => control.abort();
  }, [state]);

  useEffect(() => {
    const id: string | null = searchparams.get("id");
    if (id) {
      getWilder(id); // lorsque le param id est défini, on va récupérer le wilder
    } else {
      setState(initialState); //remet le wilder à l'état initial si je me retrouve dans l'ajout
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
        />
        <input
          onChange={handleChange}
          value={state.last_name}
          name="last_name"
        />
        <input onChange={handleChange} value={state.email} name="email" />
        <button>Valider</button>
      </form>
    </div>
  );
}
export default Formulaire;
