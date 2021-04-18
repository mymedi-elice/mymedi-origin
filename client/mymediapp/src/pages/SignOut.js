import { Box, Center, Container, Heading } from "@chakra-ui/layout";
import { useState, useEffect, useCallback, useContext } from "react";
import MainLayout from "../components/MainLayout";
import useConfirmLogin from "../components/useConfirmLogin";
import { useTranslation } from "react-i18next";
import UserInfoForm from "../components/UserInfoForm";
import Sidebar from "../components/SideBar";
import axios from "axios";
import { serverUrl } from "../config";
import { LanguageContext } from "../context";
import { Button } from "@chakra-ui/button";

export default function SignOut() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);

  const { language, setLanguage } = useContext(LanguageContext);

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

  const data = {
    title: t("mypage.signOut.title"),
    content: t("mypage.signOut.warning"),
    buttonText: t("mypage.signOut.button"),
  };

  const signOut = useCallback(async () => {
    const res = await axios.delete();
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
        <Sidebar />
        <Box float="right">
          <Center>
            <Box
              className="container"
              boxShadow="base"
              maxWidth="500px"
              mx="50"
              mt="100"
              mb="350"
              padding="50"
              textAlign="center"
            >
              <Heading size="md">{data.title}</Heading>
              <Container m="3">{data.content}</Container>
              <Button onClick={signOut}>{data.buttonText}</Button>
            </Box>
          </Center>
        </Box>
      </Box>
    </MainLayout>
  );
}
