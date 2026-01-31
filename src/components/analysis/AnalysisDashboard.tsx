import { Box, SimpleGrid, Spinner, Center, Alert, Text } from '@chakra-ui/react';
import { useTrendAnalysis } from '../../hooks/useTrendAnalysis';
import VelocityChart from './VelocityChart';
import InsightsPanel from './InsightsPanel';

const AnalysisDashboard = () => {
  const { data, isLoading, error } = useTrendAnalysis();

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert.Root status="error" variant="subtle" mt={4}>
        <Alert.Indicator />
        <Alert.Content>
           <Alert.Title>Analysis Failed</Alert.Title>
           <Alert.Description>{error}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    );
  }

  if (!data) return null;

  return (
    <Box w="100%" p={8} color={"black"}>
      <Box mb={10} w={"50%"} justifySelf={"center"}>
        <Text fontSize="xl" fontWeight="bold" mb={4} justifySelf={"center"}>AI Insights</Text>
        <InsightsPanel insights={data.insights} />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>

        <VelocityChart data={data.chart_velocity} />

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
           <Text fontSize="lg" fontWeight="bold" mb={4}>{data.chart_forecast.title}</Text>
           <Text color="gray.500">
             Timeline data available: {data.chart_forecast.labels.length} months
           </Text>
        </Box>

      </SimpleGrid>
      
      <Text mt={4} fontSize="xs" color="gray.400" textAlign="right">
        Analysis based on {data.data_points} data points.
      </Text>
    </Box>
  );
};

export default AnalysisDashboard;