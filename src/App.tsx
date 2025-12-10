import Navbar from "@/components/navbar";
import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
// Remove: import Body from "./components/body"; 

function App() {
  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <Container fluid p={0} h={"10vh"}>
        <Navbar />
      </Container>
      
      <Box flex="1" overflow="auto"> 
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default App;