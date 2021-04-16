import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import { useState, useEffect, useCallback, useContext } from "react";
import MainLayout from "../components/MainLayout";
import useConfirmLogin from "../components/useConfirmLogin";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/SideBar";
import axios from "axios";
import { serverUrl } from "../config";
import { LanguageContext } from "../context";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";

export default function MyPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);

  const { language, setLanguage } = useContext(LanguageContext);
  const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;

  const [userInfo, setUserInfo] = useState();

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
      getUserInfo();
    }
  }, [isConfirmed]);

  const getUserInfo = useCallback(async () => {
    const res = await axios.get(serverUrl + "/userinfo", {
      headers: {
        Authorization: AuthStr,
      },
    });
    setUserInfo(res.data.result);
    console.log(res);
  }, []);

  const label = {
    title: t("mypage.show.title"),
    profile: {
      name: t("mypage.form.name"),
      gender: t("mypage.form.gender.label"),
      birth: t("mypage.form.birth"),
    },
    family: t("mypage.form.family"),
    edit: t("mypage.show.edit"),
  };
  const translateGender = {
    male: t("mypage.form.gender.male"),
    female: t("mypage.form.gender.female"),
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
      {userInfo ? (
        <Box maxW="1000px" my="50px">
          <Sidebar />
          <Box float="right">
            <Center>
              <VStack>
                <Box
                  className="container"
                  maxWidth="800px"
                  padding="50"
                  textAlign="center"
                >
                  <Box my="30px">
                    <Heading size="md" my="20px">
                      {label.title}
                    </Heading>
                    <Center>
                      <UserProfile
                        label={label.profile}
                        info={userInfo}
                        translateGender={translateGender}
                      />
                    </Center>
                  </Box>
                  {userInfo.family_info ? (
                    <>
                      <Divider />
                      <Box>
                        <Heading size="md" my="20px">
                          {label.family}
                        </Heading>
                      </Box>
                      <Wrap>
                        {userInfo.family_info.map((member) => (
                          <UserProfile
                            label={label.profile}
                            info={member}
                            translateGender={translateGender}
                          />
                        ))}
                      </Wrap>
                    </>
                  ) : null}
                </Box>
                <Button marginBottom="50px">
                  <Link to="/mypage/update/1">{label.edit}</Link>
                </Button>
              </VStack>
            </Center>
          </Box>
        </Box>
      ) : (
        <Box bg="white" height="800px" py="500px"></Box>
      )}
    </MainLayout>
  );
}

const UserProfile = (props) => {
  const label = props.label;
  const info = props.info;
  const birthToDate = new Date(info.birth);
  const year = birthToDate.getFullYear();
  const month = birthToDate.getMonth() + 1;
  const day = birthToDate.getDate();
  const formatBirth = year + "-" + month + "-" + day;

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      padding="40px"
      key={info.name}
    >
      <Flex>
        <Center>
          <Avatar bg="gray.200" size="md" mr="20px" />
        </Center>
        <Box>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Box>{label.name}</Box>
              <Box>{info.name}</Box>
            </HStack>
            <HStack spacing={4}>
              <Box>{label.gender}</Box>
              <Box>{props.translateGender[info.gender]}</Box>
            </HStack>
            <HStack spacing={4}>
              <Box>{label.birth}</Box>
              <Box>{formatBirth}</Box>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};
