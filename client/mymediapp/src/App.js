import React, { useState } from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Introduction from "./pages/Introduction";
import CalendarPage from "./pages/CalendarPage";
import SearchHospital from "./pages/SearchHospital";

import { LanguageContext } from "./context";

function App() {
  const [language, setLanguage] = useState("korean");
  const languageValue = { language, setLanguage };

  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <LanguageContext.Provider value={languageValue}>
            <Home></Home>
          </LanguageContext.Provider>
        </Route>
        <Route path="/myPage">
          <LanguageContext.Provider value={languageValue}>
            <MyPage></MyPage>
          </LanguageContext.Provider>
        </Route>
        <Route path="/intro">
          <LanguageContext.Provider value={languageValue}>
            <Introduction></Introduction>
          </LanguageContext.Provider>
        </Route>
        <Route path="/calendar">
          <LanguageContext.Provider value={languageValue}>
            <CalendarPage></CalendarPage>
          </LanguageContext.Provider>
        </Route>
        <Route path="/map">
          <SearchHospital></SearchHospital>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
