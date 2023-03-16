import Accueil from "./pages/Accueil";
import Formulaire from "./pages/Formulaire";
import Liste from "./components/Liste";
import NotFound from "./pages/errors/NotFound";
import Suppression from "./pages/Suppression";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import InternalError from "./pages/errors/InternalError";
// import logo from "./logo.svg";
//module bundler

function App(): JSX.Element {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Accueil />}>
          <Route index element={<Liste />} />
          <Route path="create-or-edit" element={<Formulaire />} />
          <Route path="delete/:id" element={<Suppression />} />
          <Route path="errors">
            <Route path="404" element={<NotFound />} />
            <Route path="500" element={<InternalError />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
