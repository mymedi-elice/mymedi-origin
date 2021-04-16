/*global kakao*/
import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { serverUrl } from "../config";

import MainLayout from "../components/MainLayout";
import Search from "../components/Search";
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
  Link,
} from "@chakra-ui/layout";
import { Image, Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const { kakao } = window;

export default function SearchHospital() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allHospital, setAllHospital] = useState();

  useEffect(() => {
    setIsLoggedIn(isConfirmed);
    if (isConfirmed) {
      setIsPending(false);
    } else {
      //로그인 에러
    }
  }, [isConfirmed]);

  const getHospital = useCallback(async () => {
    const data = await axios.get(serverUrl + "/hospital");
    setAllHospital(data.data.data);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
    getHospital();
  }, []);

  useEffect(() => {
    if (allHospital) {
      if (allHospital.hospital.length > 0) {
        createMarker(allHospital.hospital);
      }
    }
  }, [allHospital]);

  const createMarker = (all) => {
    const { kakao } = window;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.8694603, 127.742282),
      level: 7,
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

    all.forEach((hospital) => {
      geocoder.addressSearch(hospital.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          let marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            title: hospital.name,
          });
        }
      });
    });
  };


  const [searchedHospital, setSearchedHospital] = useState();
  const postName = useCallback(async (place) => {
    console.log(place);
    const res = await axios.post(serverUrl + "/hospital", null, {params: { name: place }});
    console.log(res);
    setSearchedHospital(res.data.data);
  }, []);
  console.log("s", searchedHospital);

  useEffect(() => {
    if (searchedHospital) {
      if (searchedHospital.hospital.length > 0) {
        createMarker(searchedHospital.hospital);
      }
    }
  }, [searchedHospital]);

  // function nameHospital(name) {
  //   console.log(name);
  // }

  const nameHospital = (name) => {
    const { kakao } = window;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.2711184, 127.0060764),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(name, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        let marker = new kakao.maps.Marker({
          map: map,
          position: coords,
          title: name,
        });
        map.panTo(coords);
      }
    });
  };

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
              <div
                id="map"
                style={{
                  width: "500px",
                  height: "500px",
                }}
              ></div>
              <div></div>
              <Spacer />
              <Search postHospital={postName}></Search>
              <Box maxWidth="400px" alignItems="baseline" ml={5}></Box>
            </Flex>
            <section>{searchedHospital &&
              searchedHospital.hospital.map((h)=>(
                <div key={h.id}>
                  <Link color="darkcyan" onClick={(e) => nameHospital(h.address)}><strong>{h.name}</strong></Link>
                  <p>{h.phone}</p>
                  <Accordion allowToggle>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            보유 백신 리스트
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {h.vaccine.map((v)=>(<li>{v}</li>))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}</section>
          </Box>
        </Stack>
      </Center>
    </MainLayout>
  );
}
