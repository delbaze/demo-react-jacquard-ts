import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Suppression() {
  const { id } = useParams();
  const [state, setState] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const recupData = async () => {
      const signal = controller.signal;
      let response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/wilder/find/${id}`,
        { signal }
      );
      let data = await response.json();
      if (!data.success && response.status !== 200) {
        return navigate("/errors/404");
      }
      setState(data);
    };
    recupData();

    return () => controller.abort();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = await fetch(
      `${process.env.REACT_APP_BACK_URL}/wilder/delete/${id}`,
      { method: "DELETE" }
    );
    const data = await response.json();
    console.log(data);
    if (data.success) {
      return navigate("/");
    }
    setError(data.message);
  };
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
