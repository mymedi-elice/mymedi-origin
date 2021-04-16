import { Box, VStack, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function SideBar() {
  const { t } = useTranslation();
  const data = {
    title: t("mypage.sideBar.title"),
    links: [
      [t("mypage.sideBar.links.1"), "/mypage"],
      [t("mypage.sideBar.links.2"), "/mypage/signout"],
    ],
  };
  return (
    <VStack float="left" mt="70px">
      <Box>
        <Heading size="md">{data.title}</Heading>
      </Box>
      <Box
        overflowX="hidden"
        py="10px"
        px="10px"
        bg="teal.500"
        borderRadius="lg"
      >
        {data.links.map(([name, goto]) => (
          <Link to={goto} key={name}>
            <Box
              w="100%"
              py="5px"
              px="20px"
              _hover={{ bg: "teal.400", borderRadius: "lg" }}
            >
              {name}
            </Box>
          </Link>
        ))}
      </Box>
    </VStack>
  );
}
