import { Box, Container, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <>
      <Container fluid p={0}>
        <Box w={"100%"} h={"10vh"} display={"flex"} bg={"white"} alignItems={"center"}>
          <Box w={"50%"} paddingLeft={"2rem"}>
            <Text color={"black"} fontWeight={"medium"} fontSize={"2xl"}>TrendSense.AI</Text>
          </Box>
          <Box w={"50%"} paddingRight={"2rem"} textAlign={"right"}>
            <Text color={"black"} fontWeight={"medium"} fontSize={"lg"}>login</Text>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Navbar;
