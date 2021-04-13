import {
  Box,
  Center,
  Divider,
  Grid,
  GridItem,
  HStack,
  StackDivider,
  VStack,
} from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { logContext } from "../context";
import useConfirmLogin from "../components/useConfirmLogin";
import { useTranslation } from "react-i18next";
import UserInfoForm from "../components/UserInfoForm";
import Sidebar from "../components/SideBar";

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

export default function MyPage() {
  const { t } = useTranslation();
  const [isConfirmed, isLoggedInServer] = useConfirmLogin();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isPending, setIsPending] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsPending(true);
      isLoggedInServer();
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(isConfirmed);

    if (isConfirmed) {
      //여기에 마이페이지에 뿌려줄 회원정보 get 요청 보내는 함수 실행
      setIsPending(false);
    } else {
      //재로그인 요청
      // 재로그인 요청한 곳에서 로그인 되면 setIsPending(false);
    }
  }, [isConfirmed]);

  return (
    <div>
      <MainLayout
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isPending={isPending}
        setIsPending={setIsPending}
      >
        <Box>마이 페이지</Box>
        <UserInfoForm />
      </MainLayout>
    </div>
  );
}
