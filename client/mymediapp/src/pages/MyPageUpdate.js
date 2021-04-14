import { useState, useEffect, useCallback, useContext } from "react";
import MainLayout from "../components/MainLayout";
import useConfirmLogin from "../components/useConfirmLogin";
import { useTranslation } from "react-i18next";
import UserInfoForm from "../components/UserInfoForm";
import Sidebar from "../components/SideBar";
import axios from "axios";
import { serverUrl } from "../config";
import { LanguageContext } from "../context";

export default function MyPageUpdate() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);

  const { language, setLanguage } = useContext(LanguageContext);

  const [vaccines, setVaccines] = useState();
  const [showVaccines, setShowVaccines] = useState();

  const getVaccines = useCallback(async () => {
    const res = await axios.get(serverUrl + "/vaccine/");
    setVaccines(res.data.data);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
    getVaccines();
  }, []);

  useEffect(() => {
    if (vaccines) {
      setShowVaccines(vaccines[language]);
    }
  }, [language, vaccines]);

  console.log(language);
  console.log(vaccines);
  console.log(showVaccines);

  useEffect(() => {
    setIsLoggedIn(isConfirmed);

    if (isConfirmed) {
      //여기에 마이페이지에 뿌려줄 회원정보 get 요청 보내는 함수 실행
      setIsPending(false);
    }
  }, [isConfirmed]);

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
      language={language}
      setLanguage={setLanguage}
    >
      <Sidebar />
      {showVaccines ? <UserInfoForm vaccines={showVaccines} /> : null}
    </MainLayout>
  );
}
