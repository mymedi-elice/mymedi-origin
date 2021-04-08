import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../config";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      isLoggedInServer();
    }
  }, []);

  const isLoggedInServer = useCallback(async () => {
    const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
    const res = await axios.get(serverUrl + "/auth/protected", {
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
      localStorage.removeItem("access_token");
      console.log("log out");
    }
  }, []);

  return (
    <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      {t("language")}
    </MainLayout>
  );
}
