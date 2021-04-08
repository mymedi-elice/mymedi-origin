import React, { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import { logContext } from "./context";
import axios from "axios";
import { serverUrl } from "./config";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();

  const loggedInValue = { isLoggedIn, setIsLoggedIn };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      isLoggedInServer();
    }
  }, []);
  //이부분 이렇게 하지 말고 각 페이지마다 isloggedinserver 하기 커스텀 훅 만들기!

  const isLoggedInServer = useCallback(async () => {
    console.log("로그인 되어있는지 확인");

    const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
    const res = await axios.get(serverUrl + "/googleOauth/protected", {
      headers: {
        Authorization: AuthStr,
      },
    });

    if (res.data.status === 200) {
      setIsLoggedIn(true);
    } else {
      //일단은 이렇게 했지만
      //이제 로그아웃 시키는게 아니라 로그인 연장 모달을 띄우게 하는 걸로 기능 고치기
      //refresh token을 사용하므로 화면 변화는 없다!
      setIsLoggedIn(false);
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
      console.log("log out");
    }
  }, []);

  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <logContext.Provider value={loggedInValue}>
            <Home></Home>
          </logContext.Provider>
        </Route>
        <Route path="/myPage">
          <logContext.Provider value={loggedInValue}>
            <MyPage></MyPage>
          </logContext.Provider>
        </Route>
      </Switch>
    </main>
  );
}

export default App;
