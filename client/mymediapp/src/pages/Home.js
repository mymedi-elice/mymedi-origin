import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import { logContext } from "../context";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";

export default function Home() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(isConfirmed);
    if (isConfirmed) {
      setIsPending(false);
    }
  }, [isConfirmed]);
  //   const isLoggedInServer = useCallback(async () => {
  //     console.log("로그인 되어있는지 확인");

  //     const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
  //     const res = await axios.get(serverUrl + "/googleOauth/protected", {
  //       headers: {
  //         Authorization: AuthStr,
  //       },
  //     });
  //     if (res.data.status === 200) {
  //       setIsLoggedIn(true);
  //     } else {
  //       //일단은 이렇게 했지만
  //       //이제 로그아웃 시키는게 아니라 로그인 연장 모달을 띄우게 하는 걸로 기능 고치기
  //       //refresh token을 사용하므로 화면 변화는 없다!
  //       setIsLoggedIn(false);
  //       localStorage.removeItem("refresh_token");
  //       localStorage.removeItem("access_token");
  //       console.log("log out");
  //     }
  //   }, []);

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
    >
      {t("language")}
    </MainLayout>
  );
}
