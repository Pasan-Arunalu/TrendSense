import { Box, Text, Spinner, Badge, Flex, Heading, VStack } from '@chakra-ui/react';
import { useHotTrends } from '../hooks/useHotTrends';
import type { Trend } from '../types/hotTrends';

const HotTrends = () => {
  const { trends, isLoading, error } = useHotTrends();

  const slots: (Trend | null)[] = [...Array(4)].map((_, i) => trends[i] || null);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%" w="100%">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100%" w="100%">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <VStack gap={5} h="100%" w="100%" justify="center" cursor={"pointer"} lg={{flexDirection: "row", h: "100%", mt: 5}}>
      {slots.map((trend, index) => (
        <Box
          key={index}
          h="25%"
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="gray.50"
          _hover={trend ? { borderColor: "teal.300", bg: "white", boxShadow: "sm" } : {}}
          transition="all 0.2s"
          lg={{h: "100%"}}
        >
          {!trend ? (
            <Text color="gray.300" fontSize="sm" w="100%" textAlign="center">
              Slot Available
            </Text>
          ) : (
            <>
              <Box h={"auto"} color={'black'}>
                <Flex align="center" gap={2} mb={1}>
                  <Heading size="xl">{trend.name}</Heading>
                  <Badge colorScheme="purple" variant="solid" fontSize="0.6em">
                    {trend.product}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  {trend.top_region} • Vol: {trend.volume}
                </Text>
                <Flex gap={2} mt={2}>
                  {trend.tags.map((tag) => (
                    <Badge color={"black"} key={tag} variant="outline" fontSize="0.8em" colorScheme="gray">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              </Box>

              <Box textAlign="right">
                <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                  {trend.score}
                </Text>
                <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                  Velocity
                </Text>
              </Box>
            </>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default HotTrends;