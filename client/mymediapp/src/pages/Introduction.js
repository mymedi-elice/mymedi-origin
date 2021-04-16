import React, { useState, useEffect, useContext } from "react";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Image, Tag } from "@chakra-ui/react";
import { LanguageContext } from "../context";

export default function Introduction() {
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

  const sub1 = {
    title: t("intro.sub1.title"),
    contents1: t("intro.sub1.contents"),
    imageUrl: "https://ifh.cc/g/OS34zA.png",
    imageAlt: t("intro.sub1.imageAlt"),
    hastags: [
      [t("intro.sub1.hashtags.1"), "blue"],
      [t("intro.sub1.hashtags.2"), "orange"],
      [t("intro.sub1.hashtags.3"), "green"],
    ],
  };

  const sub2 = {
    title: t("intro.sub2.title"),
    contents1: t("intro.sub2.contents.1"),
    contents2: t("intro.sub2.contents.2"),
    imageUrl: "https://ifh.cc/g/B5HBhe.png",
    imageAlt: t("intro.sub2.imageAlt"),
    hastags: [
      [t("intro.sub2.hashtags.1"), "pink"],
      [t("intro.sub2.hashtags.2"), "orange"],
      [t("intro.sub2.hashtags.3"), "yellow"],
      [t("intro.sub2.hashtags.4"), "green"],
      [t("intro.sub2.hashtags.5"), "teal"],
    ],
  };
  //나중에 색 맞춰서 넣기...

  const sub3 = {
    title: t("intro.sub3.title"),
    contents1: t("intro.sub3.contents"),
    imageUrl: "https://ifh.cc/g/UQGKqY.png",
    imageAlt: t("intro.sub3.imageAlt"),
    hastags: [
      [t("intro.sub3.hashtags.1"), "blue"],
      [t("intro.sub3.hashtags.2"), "orange"],
      [t("intro.sub3.hashtags.3"), "green"],
    ],
  };
  const sub4 = {
    title: t("intro.sub4.title"),
    contents1: t("intro.sub4.contents"),
    imageUrl: "https://ifh.cc/g/D57XCi.png",
    imageAlt: t("intro.sub4.imageAlt"),
    hastags: [
      [t("intro.sub4.hashtags.1"), "pink"],
      [t("intro.sub4.hashtags.2"), "orange"],
      [t("intro.sub4.hashtags.3"), "yellow"],
      [t("intro.sub4.hashtags.4"), "green"],
    ],
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
      <Center maxWidth="800px" m={50}>
        <Stack spacing={10}>
          <Heading size="xl">{t("intro.title")}</Heading>
          <Box align="center">
            <Text size="2xl">{t("intro.sum-intro")}</Text>
          </Box>
          <Box
            maxWidth="750px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={10}
          >
            <Flex>
              <Image
                maxWidth="250px"
                src={sub1.imageUrl}
                alt={sub1.imageAlt}
              ></Image>
              <Spacer />
              <Box maxWidth="400px" alignItems="baseline" ml={5}>
                <Heading size="lg" mt={6} mb={6}>
                  {sub1.title}
                </Heading>
                <Box align="center">
                  <Text size="lg" noOfLines={[1, 2, 3]} mb={3}>
                    {sub1.contents1}
                  </Text>
                  {sub1.hastags.map(([hashtag, color], ind) => (
                    <Tag colorScheme={color} m={1.5} key={ind}>
                      #{hashtag}
                    </Tag>
                  ))}
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box
            maxWidth="750px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={10}
          >
            <Heading size="lg" mt={6} mb={6}>
              {sub2.title}
            </Heading>
            <Box align="center">
              <Text size="lg" noOfLines={[1, 2, 3]} mb={3}>
                {sub2.contents1}
              </Text>
            </Box>
            <Center m={5}>
              <Image src={sub2.imageUrl} alt={sub2.imageAlt}></Image>
            </Center>
            <Box align="center">
              <Text size="lg" noOfLines={[1, 2, 3]} mb={3}>
                {sub2.contents2}
              </Text>
              {sub2.hastags.map(([hashtag, color], ind) => (
                <Tag colorScheme={color} m={1.5} key={ind}>
                  #{hashtag}
                </Tag>
              ))}
            </Box>
          </Box>
          <Box
            maxWidth="750px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={10}
          >
            <Heading size="lg" mt={6} mb={6}>
              {sub3.title}
            </Heading>
            <Center m={5}>
              <Image src={sub3.imageUrl} alt={sub3.imageAlt}></Image>
            </Center>
            <Box align="center">
              <Text size="lg" noOfLines={[1, 2, 3, 4]} mb={3}>
                {sub3.contents1}
              </Text>
              {sub3.hastags.map(([hashtag, color], ind) => (
                <Tag colorScheme={color} m={1.5} key={ind}>
                  #{hashtag}
                </Tag>
              ))}
            </Box>
          </Box>
          <Box
            maxWidth="750px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={10}
          >
            <Heading size="lg" mt={6} mb={6}>
              {sub4.title}
            </Heading>
            <Center m={5}>
              <Image src={sub4.imageUrl} alt={sub4.imageAlt}></Image>
            </Center>
            <Box align="center">
              <Text size="lg" noOfLines={[1, 2, 3]} mb={3}>
                {sub4.contents1}
              </Text>
              {sub4.hastags.map(([hashtag, color], ind) => (
                <Tag colorScheme={color} m={1.5} key={ind}>
                  #{hashtag}
                </Tag>
              ))}
            </Box>
          </Box>
        </Stack>
      </Center>
    </MainLayout>
  );
}
