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
import { useContext, useState } from "react";
import MainLayout from "../components/MainLayout";
import { logContext } from "../context";

export default function MyPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(logContext);

  return (
    <div>
      <MainLayout>
        <Box>마이 페이지</Box>
        <Grid
          h="800px"
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(5, 1fr)"
          alignItems="center"
        >
          <GridItem rowSpan={1} colSpan={1}>
            <VStack align="stretch">
              <Box></Box>
            </VStack>
          </GridItem>
          <Divider h="90%" orientation="vertical" />
          <GridItem rowSpan={1} colSpan={4}></GridItem>
        </Grid>
      </MainLayout>
    </div>
  );
}
