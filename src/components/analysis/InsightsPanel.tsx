import React from 'react';
import { Box, Text, Wrap, WrapItem, Badge, SimpleGrid } from '@chakra-ui/react';
import type { InsightsData } from '../../types/analysis';

interface Props {
  insights: InsightsData;
}

const InsightSection = ({ title, items, color }: { title: string, items: string[], color: string }) => (
  <Box p={4} bg="gray.50" borderRadius="md">
    <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={3} textTransform="uppercase">
      Top {title}
    </Text>
    <Wrap>
      {items.map((item, i) => (
        <WrapItem key={i}>
          <Badge colorScheme={color} p={1} borderRadius="md">
            {item}
          </Badge>
        </WrapItem>
      ))}
    </Wrap>
  </Box>
);

const InsightsPanel: React.FC<Props> = ({ insights }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} w="100%" justifyItems={"center"}>
      <InsightSection title="Colors" items={insights.colors} color="pink" />
      <InsightSection title="Fabrics" items={insights.fabrics} color="cyan" />
      <InsightSection title="Styles" items={insights.styles} color="purple" />
    </SimpleGrid>
  );
};

export default InsightsPanel;