import { Home } from "./pages/Home";
import "./App.css";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <div>
            <Home></Home>
          </div>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
