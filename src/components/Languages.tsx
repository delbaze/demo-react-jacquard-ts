import { INote } from "./components.d";

function Languages({ notes }: { notes: INote[] }): JSX.Element {
// const Languages: React.FC<{ notes: INote[] }> = ({ notes }) => {
  //la ligne du dessus est une autre manière de définir une fonction comme un composant React (FC pour Function Component).
  //Notez bien que l'écriture diffère déjà de part la fonction fléchée  mais au delà de celà, il n'y a plus le : JSX.Element.
  //React.FC  ajoute la vérification du type et l'autocomplétion pour les propriétés statiques telles que "displayName", "propTypes",  "defaultProps", ou encore "displayName"
  // Il ajoute également une définition implicite pour les composants enfants avec "children" et le type de retour.
  //Pour info, Facebook pour l'instant ne le conseille pas particulièrement à cause de soucis récurrents avec le defaultProps ou le type implicite children
  //La ligne 3 est plus de l'ordre du typage "classique" mais fonctionne bien également.
  return (
    <div>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            {n.language.label}: {n.note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Languages;
