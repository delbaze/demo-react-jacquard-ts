import "./WilderDetails.css";
import Languages from "./Languages";
import { Link } from "react-router-dom";
export default function WilderDetail({
  wilder: { first_name, last_name, email, note, id },
}) {

  return (
    <div className="card">
      <p>{first_name}</p>
      <p>{last_name}</p>
      <p>{email}</p>
      <Languages notes={note} />
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
