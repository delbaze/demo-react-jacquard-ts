import WilderDetail from './WilderDetail';
import { IWilder } from './components.d';
import { useEffect, useState } from 'react';
function Liste(): JSX.Element {
  const [wilderList, setWilderList] = useState<IWilder[]>([]);
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
      console.log('%c⧭', 'color: #00e600', data);

      setWilderList(data);
    };
    recupData();

    return () => controller.abort();
  }, []);
  useEffect(() => {
    console.log("data", wilderList)
  }, [wilderList])
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
