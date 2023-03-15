import { INote } from './components.d';

function Languages({ notes }: { notes: INote[] }): JSX.Element {
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
}

export default Languages;
