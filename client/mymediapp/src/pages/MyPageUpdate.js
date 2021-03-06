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
import { useToast } from "@chakra-ui/toast";

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

  const [userInfo, setUserInfo] = useState();
  const history = useHistory();
  const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
  const toast = useToast();

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
        getUserInfo();
      } else {
        setUserInfo({
          user: user,
          data: {
            name: "",
            gender: "",
            birth: "",
            vaccine: [],
            family_info: [],
          },
        });
      }
    }
  }, [isConfirmed]);

  const getUserInfo = useCallback(async () => {
    const res = await axios.get(serverUrl + "/userinfo", {
      headers: {
        Authorization: AuthStr,
      },
    });
    setUserInfo({ user: user, data: res.data.result });
  }, []);

  const getVaccines = useCallback(async () => {
    const res = await axios.get(serverUrl + "/vaccine/");
    setVaccines(res.data.data);
  }, []);

  const updateInfo = useCallback(async (data) => {
    const res = await axios.put(serverUrl + "/userinfo", data, {
      headers: {
        Authorization: AuthStr,
      },
    });
    console.log(res);
    history.push("/mypage");
    if (res.data.status === 200) {
      toast({
        description: t("mypage.toast.update.success"),
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        description: t("mypage.toast.update.error"),
        status: "error",
        isClosable: true,
      });
    }
  }, []);

  const createInfo = useCallback(async (data) => {
    const res = await axios.post(serverUrl + "/userinfo", data, {
      headers: {
        Authorization: AuthStr,
      },
    });
    console.log(res);
    history.push("/mypage");
    if (res.data.status === 200) {
      toast({
        description: t("mypage.toast.add.success"),
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        description: t("mypage.toast.add.error"),
        status: "error",
        isClosable: true,
      });
    }
  }, []);

  const deleteFamilyInfo = useCallback(async (data) => {
    const res = await axios.delete(serverUrl + "/userinfo", {
      headers: {
        Authorization: AuthStr,
      },
      data,
    });
    console.log(res);
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
        {showVaccines && userInfo ? (
          <>
            <Sidebar />
            <UserInfoForm
              vaccines={showVaccines}
              handleSave={user === "1" ? updateInfo : createInfo}
              handleDeleteFamilyInfo={deleteFamilyInfo}
              userInfo={userInfo}
            />
          </>
        ) : null}
      </Box>
    </MainLayout>
  );
}
