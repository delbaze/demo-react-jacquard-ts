import { Link, Outlet } from 'react-router-dom';

function Accueil(): JSX.Element {
  return (
    <div>
      <nav>
        <Link to={"/"}>Liste</Link>
        <Link to={"/create-or-edit"}>Ajouter un wilder</Link>
        {/* <Link to={"/"}>Liste</Link>
        <Link to={"/create-or-edit"}>Formulaire</Link> */}
      </nav>
      Accueil
      <Outlet />
    </div>
  );
}

export default Accueil;
