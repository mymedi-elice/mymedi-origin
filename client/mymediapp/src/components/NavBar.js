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
  Heading,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import MenuElement from "./Menu";
import { Link } from "react-router-dom";

const NavLink = (props) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.900"),
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
      <Box bg={useColorModeValue("gray.50", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            variant="ghost"
            colorScheme={"teal"}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"} color={"teal.700"}>
            <Link
              to="/"
              px={2}
              py={1}
              rounded={"md"}
              _hover={{
                textDecoration: "none",
                bg: useColorModeValue("gray.200", "gray.900"),
              }}
            >
              <Box color={"teal.800"}>
                <Heading size="md">MyMedi</Heading>
              </Box>
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
                color={"teal.700"}
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Text>{props.language}</Text>
              </MenuButton>
              <MenuElement
                handleMenuClick={props.handleMenuClick}
              ></MenuElement>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={"nav"} spacing={4} color={"teal.700"}>
              {Links.map(([text, link]) => (
                <NavLink key={text} goto={link}>
                  {text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
