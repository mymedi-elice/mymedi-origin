import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const SidebarContent = () => (
  <VStack>
    {/* <Link>
      <Box w="100%">즐겨찾기</Box>
    </Link> */}
    <Link to="/mypage">
      <Box w="100%">회원 정보</Box>
    </Link>
    <Link to="/mypage/signout">
      <Box w="100%">회원 탈퇴</Box>
    </Link>
  </VStack>
);

export default function SideBar() {
  return (
    <Flex>
      <Box
        width="160px"
        position="fixed"
        overflowX="hidden"
        p="20px"
        top="100px"
        left="0"
        bg="teal.500"
        borderRadius="lg"
      >
        <SidebarContent />
      </Box>
    </Flex>
  );
}
