import { useEffect, useState } from "react";
import WilderDetail from "./WilderDetail";
function Liste() {
  const [wilderList, setWilderList] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const recupData = async () => {
      let response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/wilder/list`,
        {
          signal,
        }
      );
      let data = await response.json();
 
      setWilderList(data);
    };
    recupData();

    return () => controller.abort();
  }, []);
  return (
    <div>
      Liste
      {wilderList &&
        wilderList.map((wilder) => {
          return <WilderDetail key={wilder.id} wilder={wilder} />;
        })}
    </div>
  );
}

export default Liste;
