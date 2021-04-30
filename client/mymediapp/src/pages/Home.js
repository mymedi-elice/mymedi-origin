import React, { useState, useEffect, useContext } from "react";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import { Box, Grid } from "@chakra-ui/layout";
import { LanguageContext } from "../context";
import Card from "../components/Card";

export default function Home() {
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

  const introCard = {
    goto: "/intro",
    imageUrl: "https://ifh.cc/g/xjrIbS.jpg",
    imageAlt: t("home.introCard.imageAlt"),
    title: t("home.introCard.title"),
    content: t("home.introCard.content"),
  };
  const calendarCard = {
    goto: "/calendar",
    imageUrl: "https://ifh.cc/g/kNacbD.jpg",
    imageAlt: t("home.calendarCard.imageAlt"),
    title: t("home.calendarCard.title"),
    content: t("home.calendarCard.content"),
  };
  const mapCard = {
    goto: "/map",
    imageUrl: "https://ifh.cc/g/2H06dI.jpg",
    imageAlt: t("home.mapCard.imageAlt"),
    title: t("home.mapCard.title"),
    content: t("home.mapCard.content"),
  };

  const CardList = [introCard, calendarCard, mapCard];

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
      language={language}
      setLanguage={setLanguage}
    >
      <Grid my="220px" mx="200px" templateColumns="repeat(3, 1fr)" gap={4}>
        {CardList.map((card) => (
          <Box key={card.title}>
            <Card data={card} />
          </Box>
        ))}
      </Grid>
    </MainLayout>
  );
}
