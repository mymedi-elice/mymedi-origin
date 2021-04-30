import { Box, GridItem } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { Link } from "react-router-dom";
export default function Card(props) {
  const data = props.data;
  return (
    <GridItem colSpan={1}>
      <Link to={data.goto}>
        <Box
          maxW="sm"
          minW="120px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          height="420px"
          _hover={{
            boxShadow: "xl",
          }}
        >
          <Image src={data.imageUrl} alt={data.imageAlt} />

          <Box p="6">
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              py="6px"
            >
              {data.title}
            </Box>
            <Box pb="1">{data.content}</Box>
          </Box>
        </Box>
      </Link>
    </GridItem>
  );
}
