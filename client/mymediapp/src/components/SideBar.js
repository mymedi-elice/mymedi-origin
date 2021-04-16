import { Box, VStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function SideBar() {
  const data = {
    title: "내 정보",
    links: [
      ["회원 정보", "/mypage"],
      ["회원 탈퇴", "/mypage/signout"],
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
