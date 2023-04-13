import {
  NavigateFunction,
  Params,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_WILDER } from "../graphql/mutations/wilders.mutation";
import { FIND_WILDER } from "../graphql/queries/wilders.query";
function Suppression(): JSX.Element {
  const { id }: Readonly<Params<string>> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [deleteWilder] = useMutation(DELETE_WILDER);
  const { data } = useQuery(FIND_WILDER, { variables: { findWilderId: id } });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    deleteWilder({
      variables: { deleteWilderId: id },
      onCompleted(data) {
        if (data?.deleteWilder.success) {
          return navigate("/");
        }
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Voulez vous supprimer {data?.findWilder?.first_name}?</h1>
        <button>Confirmer suppression?</button>
      </form>
    </div>
  );
}
export default Suppression;
