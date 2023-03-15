function Languages({ notes }) {
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
