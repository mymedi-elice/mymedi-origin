import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  propNames,
  Spinner,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import MenuElement from "./Menu";
import { Link } from "react-router-dom";

const NavLink = (props) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    to={props.goto}
  >
    {props.children}
  </Link>
);

export default function NavBar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Links = props.links;
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link
              to="/"
              px={2}
              py={1}
              rounded={"md"}
              _hover={{
                textDecoration: "none",
              }}
            >
              <Box>Logo</Box>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(([text, link]) => (
                <NavLink key={text} goto={link}>
                  {text}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {props.pending ? (
              <Button
                isLoading
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
              >
                {props.logButton}
              </Button>
            ) : (
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                onClick={props.onClickLogButton}
              >
                {props.logButton}
              </Button>
            )}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
              >
                {props.language}
              </MenuButton>
              <MenuElement
                handleMenuClick={props.handleMenuClick}
              ></MenuElement>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(([text, link]) => (
                <NavLink key={text} goto={link}>
                  {text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>Main Content Here</Box> */}
    </>
  );
}
