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
  List,
  ListItem,
  ListIcon,
  HStack,
} from "@chakra-ui/layout";
import {
  Image,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { LanguageContext } from "../context";
import { CheckIcon } from "@chakra-ui/icons";

const { kakao } = window;

export default function SearchHospital() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);
  const [allHospital, setAllHospital] = useState();

  const { language, setLanguage } = useContext(LanguageContext);

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
    setIsLoggedIn(isConfirmed);
    if (isConfirmed) {
      setIsPending(false);
    }
  }, [isConfirmed]);

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
    const res = await axios.post(serverUrl + "/hospital", null, {
      params: { name: place },
    });
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

  const text = {
    title: t("hospital.title"),
    search: {
      placeHolder: t("hospital.search.placeHolder"),
      button: t("hospital.search.button"),
    },
    vaccine: t("hospital.vaccine"),
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
          <Heading size="xl">{text.title}</Heading>
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
              <Search postHospital={postName} text={text.search}></Search>
            </Flex>
            <section>
              {searchedHospital &&
                searchedHospital.hospital.map((h) => (
                  <Box key={h.id} mt="5px">
                    <Accordion allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Link
                                color="teal"
                                onClick={(e) => nameHospital(h.address)}
                              >
                                <Text fontWeight="semibold">{h.name}</Text>
                              </Link>
                              <Box mb="5px" fontSize="12px" color="gray.400">
                                {h.phone}
                              </Box>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Box mb="10px">{text.vaccine}</Box>
                          <List>
                            {h.vaccine.map((v, ind) => (
                              <ListItem key={ind}>
                                <HStack>
                                  <ListIcon
                                    as={CheckIcon}
                                    color="teal"
                                    boxSize="10px"
                                  />
                                  <Text fontSize="13px">{v}</Text>
                                </HStack>
                              </ListItem>
                            ))}
                          </List>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                ))}
            </section>
          </Box>
        </Stack>
      </Center>
    </MainLayout>
  );
}
