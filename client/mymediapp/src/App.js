import React from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Introduction from "./pages/Introduction";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/myPage">
          <MyPage></MyPage>
        </Route>
        <Route path="/intro">
          <Introduction></Introduction>
        </Route>
        <Route path="/calendar">
          <CalendarPage></CalendarPage>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
