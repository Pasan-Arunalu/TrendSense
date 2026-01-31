import { Box } from "@chakra-ui/react";
import HotTrends from "../components/HotTrends";
import AnalysisDashboard from "@/components/analysis/AnalysisDashboard";

const Body = () => {
  return (
    <Box h="100%" bgColor="white">
      <Box
        h="100%"
        p={8}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        lg={{ h: "40vh" }}
      >
        <HotTrends />
      </Box>
      <AnalysisDashboard />
    </Box>
  );
};

export default Body;
