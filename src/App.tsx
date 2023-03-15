// import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Formulaire from "./pages/Formulaire";
import Suppression from "./pages/Suppression";
import Liste from "./components/Liste";
import NotFound from "./pages/errors/NotFound";
//module bundler

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Accueil />}>
          <Route index element={<Liste />} />
          <Route path="create-or-edit" element={<Formulaire />} />
          <Route path="delete/:id" element={<Suppression />} />
          <Route path="errors">
            <Route path="404" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
