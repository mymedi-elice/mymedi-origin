import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import i18n from "i18next";

import NavBar from "./NavBar";
import Footer from "./Footer";

import { useHistory } from "react-router-dom";

export default function MainLayout(props) {
  const { t } = useTranslation();
  const [language, setLanguage] = useState();

  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = (v) => {
    props.setIsLoggedIn(v);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();
  const isPending = props.isPending;
  const setIsPending = (v) => {
    props.setIsPending(v);
  };

  useEffect(() => {
    if (window.location.search && !isLoggedIn) {
      handleSendCode(window.location.href);
      history.push({ search: "" });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const languageDict = {
      Korean: "ko",
      English: "en",
      Vietnamese: "vi",
    };

    if (language) {
      i18n.changeLanguage(languageDict[language]);
    }
  }, [language]);

  const Links = [
    [t("navbar.intro"), "/intro"],
    [t("navbar.calendar"), "/calendar"],
    [t("navbar.search"), "/#"],
    [t("navbar.mypage"), "/mypage"],
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.replace(window.location.href);
  };

  const handleLogin = () => {
    window.location.replace(serverUrl + "/googleOauth/login");
  };

  const handleSendCode = async (url) => {
    setIsPending(true);
    const res = await axios.get(serverUrl + "/googleOauth/callback", {
      params: {
        url: url,
      },
    });
    if (res.data.status === 200) {
      setIsPending(false);
      setIsLoggedIn(true);
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      if (res.data.user === false) {
        setOpenDialog(true);
        //첫 로그인이면 회원정보 입력 페이지로 보내기 위한 모달이 띄워진다.
      }
    }
  };

  const dialogToMypage = {
    title: t("dialogToMypage.title"),
    contents: t("dialogToMypage.contents"),
    yes: t("answer.yes"),
    no: t("answer.no"),
  };

  return (
    <div>
      <NavBar
        language={t("language")}
        handleMenuClick={(item) => {
          console.log(item);
          setLanguage(item);
        }}
        links={Links}
        logButton={isLoggedIn ? t("navbar.logout") : t("navbar.login")}
        onClickLogButton={isLoggedIn ? handleLogout : handleLogin}
        logstat={isLoggedIn}
        pending={isPending}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <AlertToMypage
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        data={dialogToMypage}
      />
      <Center>{props.children}</Center>
      <Footer />
    </div>
  );
}

const AlertToMypage = (props) => {
  const isOpen = props.openDialog;
  const setIsOpen = (v) => {
    props.setOpenDialog(v);
  };
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{props.data.title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{props.data.contents}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {props.data.no}
            </Button>
            <Link to="/myPage">
              <Button colorScheme="red" ml={3} onClick={onClose}>
                {props.data.yes}
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
