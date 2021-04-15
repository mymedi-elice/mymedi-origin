import { useState, useEffect, useCallback, useContext } from "react";
import MainLayout from "../components/MainLayout";
import useConfirmLogin from "../components/useConfirmLogin";
import { useTranslation } from "react-i18next";
import UserInfoForm from "../components/UserInfoForm";
import Sidebar from "../components/SideBar";
import axios from "axios";
import { serverUrl } from "../config";
import { LanguageContext } from "../context";
import { useHistory, useParams } from "react-router-dom";
import { Box, Center } from "@chakra-ui/layout";

export default function MyPageUpdate() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);

  const { language, setLanguage } = useContext(LanguageContext);

  const [vaccines, setVaccines] = useState();
  const [showVaccines, setShowVaccines] = useState();

  const { user } = useParams();
  //user이 0이면 post 사용, 1이면 put 사용.
  const history = useHistory();
  const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;

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

  useEffect(() => {
    setIsLoggedIn(isConfirmed);

    if (isConfirmed) {
      setIsPending(false);
      if (user === "1") {
        //여기에 마이페이지에 뿌려줄 회원정보 get 요청 보내는 함수 실행 (첫 로그인이 아님)
      }
    }
  }, [isConfirmed]);

  const updateInfo = useCallback(async (data) => {
    const res = await axios.put(serverUrl + "/userinfo/", data, {
      headers: {
        Authorization: AuthStr,
      },
    });
    // history.push("/mypage");
  }, []);

  const createInfo = useCallback(async (data) => {
    const res = await axios.post(serverUrl + "/userinfo/", data, {
      headers: {
        Authorization: AuthStr,
      },
    });
    console.log(res);
    // history.push("/mypage");
  }, []);

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
      language={language}
      setLanguage={setLanguage}
    >
      <Box maxW="1000px">
        {showVaccines ? (
          <>
            <Sidebar />
            <UserInfoForm
              vaccines={showVaccines}
              handleSave={user === "1" ? updateInfo : createInfo}
            />
          </>
        ) : null}
      </Box>
    </MainLayout>
  );
}
