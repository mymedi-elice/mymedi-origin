import React, { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Introduction from "./pages/Introduction";
// import { logContext } from "./context";
// import axios from "axios";
// import { serverUrl } from "./config";

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
      </Switch>
    </main>
  );
}

export default App;
