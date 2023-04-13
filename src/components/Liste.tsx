import WilderDetail from "./WilderDetail";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LIST_WILDERS } from "../graphql/queries/wilders.query";
function Liste(): JSX.Element {
  const { data, refetch } = useQuery(LIST_WILDERS);

  useEffect(() => {
    refetch();
  }, []);
  return (
    <div>
      Liste
      {data &&
        data.wilderList.map((wilder: any) => {
          return <WilderDetail key={wilder.id} wilder={wilder} />;
        })}
    </div>
  );
}

export default Liste;
