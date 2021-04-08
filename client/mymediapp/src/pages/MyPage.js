import {
  Box,
  Center,
  Divider,
  Grid,
  GridItem,
  HStack,
  StackDivider,
} from "@chakra-ui/layout";
import { useContext, useState } from "react";
import MainLayout from "../components/MainLayout";
import { logContext } from "../context";

export default function MyPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(logContext);
  const [showFavorites, setShowFavorites] = useState();
  const [showUserInfo, setShowUserInfo] = useState();
  const [fixUserInfo, setFixUserInfo] = useState();
  const [signOut, setSignOut] = useState();

  return (
    <div>
      <MainLayout>
        <Grid
          h="800px"
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(5, 1fr)"
        >
          <GridItem rowSpan={1} colSpan={1}></GridItem>
          <Divider orientation="vertical" />
          <GridItem rowSpan={1} colSpan={1}></GridItem>
        </Grid>
      </MainLayout>
    </div>
  );
}
