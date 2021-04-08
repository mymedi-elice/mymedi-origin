import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { serverUrl } from "../config";
// import { useTranslation } from "react-i18next";
import i18n from "i18next";

import { cookiesContext } from "../context";

import NavBar from "./NavBar";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";

export default function MainLayout(props) {
  const { t } = useTranslation();
  const [language, setLanguage] = useState();
  // const [isLoggedIn, setIsLoggedIn] = useState();
  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = () => {
    props.setIsLoggedIn();
  };

  // useEffect(() => {
  //   if (localStorage.getItem("access_token")) {
  //     isLoggedInServer();
  //   }
  // }, []);
  //이 내용을 app.js에서 실행시키고 다른 세부 페이지 컴포넌트들에서는 실행시키지 않아도 괜찮을까?

  useEffect(() => {
    if (window.location.search) {
      console.log(window.location.search);
      handleSendCode(window.location.href);
    }
    // if (localStorage.getItem("access_token")) {
    //   isLoggedInServer();
    // }
  }, []);

  useEffect(() => {
    console.log(language);

    const languageDict = {
      Korean: "ko",
      English: "en",
      Vietnamese: "vi",
    };

    if (language) {
      i18n.changeLanguage(languageDict[language]);
    }
  }, [language]);

  const Links = [t("navbar.calendar"), t("navbar.search"), t("navbar.mypage")];

  // const isLoggedInServer = useCallback(async () => {
  //   const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
  //   const res = await axios.get(serverUrl + "/auth/protected", {
  //     headers: {
  //       Authorization: AuthStr,
  //     },
  //   });
  //   if (res.data.status === 200) {
  //     setIsLoggedIn(true);
  //   } else {
  //     //일단은 이렇게 했지만
  //     //이제 로그아웃 시키는게 아니라 로그인 연장 모달을 띄우게 하는 걸로 기능 고치기
  //     setIsLoggedIn(false);
  //     localStorage.removeItem("access_token");
  //     console.log("log out");
  //   }
  // }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
    console.log("log out");
  };

  const handleLogin = () => {
    window.location.replace(serverUrl + "/googleOauth/login");
  };

  const handleSendCode = async (url) => {
    console.log("실행");
    const res2 = await axios.get(serverUrl + "/googleOauth/callback", {
      params: {
        url: url,
      },
    });
    if (res2.data.status === 200) {
      setIsLoggedIn(true);
      //첫 로그인이면 회원정보 입력 페이지로 보내기 위한 모달 띄우기?
    } else {
      console.log("로그인 실패");
    }
    console.log(res2);
  };

  return (
    <div>
      <NavBar
        language={t("language")}
        handleMenuClick={(item) => {
          setLanguage(item);
          console.log(item);
        }}
        links={Links}
        logButton={isLoggedIn ? t("navbar.logout") : t("navbar.login")}
        logstat={isLoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      ></NavBar>
      {props.children}
      <Footer></Footer>
    </div>
  );
}
