import WilderDetail from "./WilderDetail";
import { IWilder } from "./components.d";
import { useEffect, useRef, useState } from "react";
function Liste(): JSX.Element {
  const [wilderList, setWilderList] = useState<IWilder[]>([]);
  const controller = useRef(new AbortController());
  const recupData = async () => {
    const signal = controller.current.signal;
    let response = await fetch(
      `${process.env.REACT_APP_BACK_URL}/wilder/list`,
      {
        signal,
      }
    );
    let data = await response.json();
    setWilderList(data);
  };
  useEffect(() => {
    recupData();
    return () => controller.current.abort();
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
