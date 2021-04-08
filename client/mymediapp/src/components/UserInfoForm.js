import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/layout";

export default function UserInfoForm() {
  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <Box p={2}>
          <Box textAlign="center">
            <Heading>
              My Page
              {/* 국제화 하기 */}
            </Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="test@test.com" />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="*******" />
              </FormControl>
              <Button width="full" mt={4} type="submit">
                Sign In
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
      <Box></Box>
    </>
  );
}
