import Navbar from "@/components/navbar";
import { Box, Container } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/";

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Container fluid p={0} h={"auto"}>
        {!hideNavbar && <Navbar />}
      </Container>

      <Box flex="1">
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
