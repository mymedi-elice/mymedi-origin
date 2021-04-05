import {
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Image,
  ChevronDownIcon,
  Button,
} from "@chakra-ui/react";

import React from "react";

export default function MenuElement(props) {
  const serviceDescriptionsData = [
    {
      id: "1",
      language: "Korean",
      flagImage: "https://www.countryflags.io/kr/flat/64.png",
    },
    {
      id: "2",
      language: "English",
      flagImage: "https://www.countryflags.io/um/flat/64.png",
    },
    {
      id: "3",
      language: "Vietnamese",
      flagImage: "https://www.countryflags.io/vn/flat/64.png",
    },
  ];
  return (
    <MenuList onClick={props.handleMenuClick}>
      {serviceDescriptionsData.map((country) => {
        return (
          <MenuItem minH="48px" key={country.id}>
            <Image
              boxSize="2rem"
              borderRadius="full"
              src={country.flagImage}
              alt={country.language}
              mr="12px"
            />
            <span>{country.language}</span>
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
