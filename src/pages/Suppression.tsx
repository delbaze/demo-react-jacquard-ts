import { IMessageWithSuccess } from "./pages.d";
import { IWilder } from "../components/components";
import {
  NavigateFunction,
  Params,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
function Suppression(): JSX.Element {
  const { id }: Readonly<Params<string>> = useParams();
  const [state, setState] = useState<IWilder | null>(null);
  const [error, setError] = useState<string>("");
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let response = await fetch(
      `${process.env.REACT_APP_BACK_URL}/wilder/delete/${id}`,
      { method: "DELETE" }
    );
    const data: IMessageWithSuccess = await response.json();
    console.log(data);
    if (data.success) {
      return navigate("/");
    }
    setError(data.message);
  };

  useEffect(() => {
    const controller: AbortController = new AbortController();
    const recupData = async () => {
      const signal: AbortSignal = controller.signal;
      let response: Response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/wilder/find/${id}`,
        { signal }
      );
      const result: IWilder | IMessageWithSuccess = await response.json();
      if (response.status !== 200 && "success" in result && !result.success) {
        return navigate("/errors/404");
      }
      setState(result as IWilder);
    };
    recupData();

    return () => controller.abort();
  }, [id, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Voulez vous supprimer {state?.first_name}?</h1>
        <button>Confirmer suppression?</button>
      </form>
      {error}
    </div>
  );
}
export default Suppression;
