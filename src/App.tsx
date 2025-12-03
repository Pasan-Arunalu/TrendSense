import { Component } from "react";
import Navbar from "./components/navbar";
import { Provider } from "./components/ui/provider";
import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Body from "./components/body";

function App() {
  return (
    <Provider>
      <Container fluid p={0} h={"10vh"}>
        <Navbar />
      </Container>
      <Container fluid p={0} h={"100%"}>
        <Body />
      </Container>

      <Box as="main" p={0}>
        <Outlet />
      </Box>
    </Provider>
  );
}

export default App;
