import React from 'react';
import { Box, Text, VStack, Progress, Flex } from '@chakra-ui/react';
import type { VelocityChartData } from '../../types/analysis';

interface Props {
  data: VelocityChartData;
}

const VelocityChart: React.FC<Props> = ({ data }) => {
  if (!data.labels || data.labels.length === 0) return <Text>No velocity data</Text>;

  const maxScore = Math.max(...data.scores, 100);

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
      <Text fontSize="lg" fontWeight="bold" mb={4}>{data.title}</Text>
      <VStack gap={4} align="stretch">
        {data.labels.map((label, index) => (
          <Box key={index}>
            <Flex justify="space-between" mb={1}>
              <Text fontWeight="medium" fontSize="sm">{label}</Text>
              <Text fontSize="sm" color="gray.500">{data.scores[index]}</Text>
            </Flex>

            <Progress.Root 
              value={(data.scores[index] / maxScore) * 100} 
              colorPalette="teal" 
              size="sm" 
            >
              <Progress.Track>
                <Progress.Range borderRadius="full" />
              </Progress.Track>
            </Progress.Root>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default VelocityChart;