/*global kakao*/
import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { serverUrl } from "../config";

import MainLayout from "../components/MainLayout";
import { useTranslation } from "react-i18next";
import useConfirmLogin from "../components/useConfirmLogin";
import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Image, Tag } from "@chakra-ui/react";

const { kakao } = window;

export default function SearchHospital() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allHospital, setAllHospital] = useState();

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
    } else {
      //로그인 에러...
    }
  }, [isConfirmed]);

  const getAllEvents = useCallback(async () => {
    const res = await axios.get(serverUrl + "/calendar/");
    if (res.status === 200) {
      const eventData = res.data.result;
      //아래 코드는 eventData가 있을때만 실행
      if (eventData !== "No upcoming events found from now") {
        const formatEvents = eventData.map((eachEvent) => {
          let color;
          if (eachEvent.color) {
            color = eachEvent.color;
          } else {
            color = "#039BE5";
          }
          return {
            id: eachEvent.id,
            title: eachEvent.summary,
            start: eachEvent.date,
            end: eachEvent.date,
            time: eachEvent.time,
            location: eachEvent.location,
            description: eachEvent.description,
            color: color,
          }; //조건문으로 달리할 수 있다.
        });
        setAllHospital(formatEvents);
      }
    }
  }, []);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);
  }, []);
  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isPending={isPending}
      setIsPending={setIsPending}
    >
      <Center maxWidth="800px" m={50}>
        <Stack spacing={10}>
          <Heading size="xl">병원 검색</Heading>
          <Box
            maxWidth="750px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={10}
          >
            <Flex>
              <div id='map' style={{
                width: '500px',
                height: '500px'
              }}></div>
              <Spacer />
              <Box maxWidth="400px" alignItems="baseline" ml={5}>
              </Box>
            </Flex>
          </Box>
        </Stack>
      </Center>
    </MainLayout>
  );
}
