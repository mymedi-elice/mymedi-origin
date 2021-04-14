import { MenuItem, MenuList, Image } from "@chakra-ui/react";

import React from "react";

export default function MenuElement(props) {
  const serviceDescriptionsData = [
    {
      id: "1",
      language: "Korean",
      languageToShow: "한국어",
      flagImage: "https://www.countryflags.io/kr/flat/64.png",
    },
    {
      id: "2",
      language: "English",
      languageToShow: "English",
      flagImage: "https://www.countryflags.io/um/flat/64.png",
    },
    {
      id: "3",
      language: "Vietnamese",
      languageToShow: "Tiếng Việt",
      flagImage: "https://www.countryflags.io/vn/flat/64.png",
    },
  ];
  return (
    <MenuList>
      {serviceDescriptionsData.map((country) => {
        //
        return (
          <MenuItem
            onClick={() => {
              props.handleMenuClick(country.language);
            }}
            minH="48px"
            key={country.id}
          >
            <Image
              boxSize="2rem"
              borderRadius="full"
              src={country.flagImage}
              alt={country.language}
              mr="12px"
            />
            <span>{country.languageToShow}</span>
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
