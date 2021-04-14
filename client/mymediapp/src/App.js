import React, { useState } from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Introduction from "./pages/Introduction";
import CalendarPage from "./pages/CalendarPage";

import { LanguageContext } from "./context";
import MyPageUpdate from "./pages/MyPageUpdate";
import SignOut from "./pages/SignOut";

function App() {
  const [language, setLanguage] = useState("korean");
  const languageValue = { language, setLanguage };

  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <LanguageContext.Provider value={languageValue}>
            <Home />
          </LanguageContext.Provider>
        </Route>
        <Route path="/myPage" exact>
          <LanguageContext.Provider value={languageValue}>
            <MyPage />
          </LanguageContext.Provider>
        </Route>
        <Route path="/mypage/update">
          <LanguageContext.Provider value={languageValue}>
            <MyPageUpdate />
          </LanguageContext.Provider>
        </Route>
        <Route path="/mypage/signout">
          <LanguageContext.Provider value={languageValue}>
            <SignOut />
          </LanguageContext.Provider>
        </Route>
        <Route path="/intro">
          <LanguageContext.Provider value={languageValue}>
            <Introduction />
          </LanguageContext.Provider>
        </Route>
        <Route path="/calendar">
          <LanguageContext.Provider value={languageValue}>
            <CalendarPage />
          </LanguageContext.Provider>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
