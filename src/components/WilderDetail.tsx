import Languages from "./Languages";
import { IWilder } from "./components.d";
import { Link } from "react-router-dom";
import "./WilderDetails.css";
export default function WilderDetail({
  wilder: { first_name, last_name, email, notes, id, avatar },
}: {
  wilder: IWilder;
}): JSX.Element {
  return (
    <div className="card">
      {avatar && <img className="preview" width={80} height={80} src={`${process.env.REACT_APP_BACK_URL}/avatars/${avatar}`} />}
      <img />
      <p>{first_name}</p>
      <p>{last_name}</p>
      <p>{email}</p>
      <Languages notes={notes} />
      <Link to={`/create-or-edit?id=${id}`}>
        <button>Editer</button>
      </Link>
      {/* <button onClick={goToDelete}>Supprimer</button> */}
      <Link to={`/delete/${id}`}>
        <button>Supprimer</button>
      </Link>
    </div>
  );
}
