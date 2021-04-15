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
      //로그인 에러
    }
  }, [isConfirmed]);

  const getHospital = useCallback(async () => {
    const data = await axios.get(serverUrl + "/hospital/");
    setAllHospital(data.data.data);
  }, []);
  console.log('a',allHospital);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
    getHospital();
  }, []);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 5
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch('서울 강남구 선릉로 433', function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
          title: "엘리스"
        });
        map.setCenter(coords);
      }
    })
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
              <div></div>
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
