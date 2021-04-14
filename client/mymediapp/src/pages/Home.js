import React, { useState, useEffect, useContext } from "react";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import { Box, Grid, GridItem, Wrap, WrapItem } from "@chakra-ui/layout";
import { LanguageContext } from "../context";
import { Image } from "@chakra-ui/image";
import { Link } from "react-router-dom";

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
    // setIsPending(false);
    if (isConfirmed) {
      setIsPending(false);
    } else {
      //로그인 에러...
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
    goto: "#",
    imageUrl: "https://ifh.cc/g/2H06dI.jpg",
    imageAlt: t("home.mapCard.imageAlt"),
    title: t("home.mapCard.title"),
    content: t("home.mapCard.content"),
  };

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
      language={language}
      setLanguage={setLanguage}
    >
      <Grid my="200px" mx="200px" templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={1}>
          <Link to={introCard.goto}>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              height="400px"
              _hover={{
                boxShadow: "xl",
              }}
            >
              <Image src={introCard.imageUrl} alt={introCard.imageAlt} />

              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  py="6px"
                >
                  {introCard.title}
                </Box>
                <Box>{introCard.content}</Box>
              </Box>
            </Box>
          </Link>
        </GridItem>
        <GridItem colSpan={1}>
          <Link to={calendarCard.goto}>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              height="400px"
              _hover={{
                boxShadow: "xl",
              }}
            >
              <Image src={calendarCard.imageUrl} alt={calendarCard.imageAlt} />

              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  py="6px"
                >
                  {calendarCard.title}
                </Box>
                <Box>{calendarCard.content}</Box>
              </Box>
            </Box>
          </Link>
        </GridItem>
        <GridItem colSpan={1}>
          <Link to={mapCard.goto}>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              height="400px"
              _hover={{
                boxShadow: "xl",
              }}
            >
              <Image src={mapCard.imageUrl} alt={mapCard.imageAlt} />

              <Box p="6">
                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  py="6px"
                >
                  {mapCard.title}
                </Box>
                <Box>{mapCard.content}</Box>
              </Box>
            </Box>
          </Link>
        </GridItem>
      </Grid>
    </MainLayout>
  );
}
