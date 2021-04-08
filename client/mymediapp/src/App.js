import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
// import { withCookies, useCookies } from "react-cookie";
import { cookiesContext } from "./context";

function App() {
  // const [cookies, setCookies] = useCookies(["user"]);
  const [hasCookie, setHasCookie] = useState(true);

  const cookiesValue = { hasCookie, setHasCookie };

  // useEffect(() => {
  //   if (cookies.user && cookies.user !== "undefined") {
  //     setHasCookie(true);
  //   }
  // }, [cookies]);

  // console.log(cookies);
  // console.log(setCookies);
  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <cookiesContext.Provider value={cookiesValue}>
            <Home></Home>
          </cookiesContext.Provider>
        </Route>
        <Route path="/myPage">
          <MyPage></MyPage>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
