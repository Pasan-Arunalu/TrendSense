import { useState } from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    VStack,
    HStack,
    Badge,
    Button,
    Icon,
} from '@chakra-ui/react';
import { LuTrendingUp, LuRefreshCw, LuActivity } from 'react-icons/lu';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TrendAnalysisDrawer } from '@/components/common/TrendAnalysisDrawer';
import { useAnalytics } from '@/hooks/useAnalytics';

export const Analytics = () => {
    const { hotTrends, categories, isLoading, refresh } = useAnalytics();

    // Drawer state - only for Category Performance
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openCategoryAnalysis = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setIsDrawerOpen(true);
    };

    const getPerformanceColor = (score: number) => {
        if (score >= 80) return { main: 'green.500', bg: 'green.50', border: 'green.200', badge: 'green' };
        if (score >= 50) return { main: 'orange.500', bg: 'orange.50', border: 'orange.200', badge: 'orange' };
        return { main: 'red.500', bg: 'red.50', border: 'red.200', badge: 'red' };
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading analytics..." />;
    }

    return (
        <Box>
            <PageHeader
                title="Analytics"
                subtitle="Trend insights and performance metrics"
                actions={
                    <Button variant="outline" size="sm" onClick={refresh}>
                        <LuRefreshCw /> Refresh
                    </Button>
                }
            />

            {/* Hot Trends - Traffic Light Colors */}
            <Box mb={8}>
                <HStack mb={4}>
                    <Icon as={LuTrendingUp} color="primary.solid" />
                    <Text fontSize="lg" fontWeight="semibold" color="fg.muted">
                        Hot Trends
                    </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                    {hotTrends.map((trend, index) => {
                        const colors = getPerformanceColor(trend.score);
                        return (
                            <Box
                                key={index}
                                bg={colors.bg}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor={colors.border}
                                p={5}
                                shadow="sm"
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                            >
                                <Text fontWeight="bold" color="fg.DEFAULT" fontSize="lg" mb={2}>
                                    {trend.name}
                                </Text>
                                <Text fontSize="sm" color="fg.muted" mb={3}>
                                    {trend.product}
                                </Text>
                                <HStack gap={2} mb={3} flexWrap="wrap">
                                    {trend.tags.map((tag, i) => (
                                        <Badge key={i} colorScheme={colors.badge} size="sm" variant="subtle">
                                            {tag}
                                        </Badge>
                                    ))}
                                </HStack>
                                <HStack justify="space-between">
                                    <VStack align="start" gap={0}>
                                        <Text fontSize="2xl" fontWeight="bold" color={colors.main}>
                                            {trend.score}
                                        </Text>
                                        <Text fontSize="xs" color="fg.muted">
                                            Velocity Score
                                        </Text>
                                    </VStack>
                                    <VStack align="end" gap={0}>
                                        <Text fontWeight="semibold" color="fg.DEFAULT">
                                            {trend.volume}
                                        </Text>
                                        <Text fontSize="xs" color="fg.muted">
                                            Volume
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Text fontSize="xs" color="fg.muted" mt={2}>
                                    Top: {trend.top_region}
                                </Text>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Category Breakdown - Traffic Light Colors */}
            <Box>
                <Text fontSize="lg" fontWeight="semibold" color="fg.muted" mb={4}>
                    Category Performance
                </Text>
                <Box bg="white" borderRadius="lg" border="1px solid" borderColor="teal.100" overflow="hidden">
                    {categories.length > 0 ? (
                        <VStack gap={0} align="stretch">
                            {categories.slice(0, 10).map((cat, index) => {
                                const maxVelocity = Math.max(...categories.map((c) => c.velocity));
                                const percentage = (cat.velocity / maxVelocity) * 100;
                                const colors = getPerformanceColor(cat.velocity);

                                return (
                                    <Box
                                        key={index}
                                        p={4}
                                        borderBottom={index < categories.length - 1 ? '1px solid' : undefined}
                                        borderColor="teal.50"
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{ bg: colors.bg }}
                                        onClick={() => openCategoryAnalysis(cat.category)}
                                    >
                                        <HStack justify="space-between" mb={2}>
                                            <HStack gap={3}>
                                                <Text fontWeight="bold" color="fg.muted" fontSize="sm" w="24px">
                                                    #{index + 1}
                                                </Text>
                                                <Text fontWeight="medium" color="fg.DEFAULT">
                                                    {cat.category}
                                                </Text>
                                                <Badge colorScheme={colors.badge} variant="subtle" fontSize="xs">
                                                    <LuActivity size={12} /> View
                                                </Badge>
                                            </HStack>
                                            <HStack gap={4}>
                                                <VStack gap={0} align="end">
                                                    <Text fontWeight="semibold" color={colors.main}>
                                                        {cat.velocity}
                                                    </Text>
                                                    <Text fontSize="xs" color="fg.muted">
                                                        Velocity
                                                    </Text>
                                                </VStack>
                                                <VStack gap={0} align="end" minW="60px">
                                                    <Text fontWeight="medium" color="fg.DEFAULT">
                                                        {cat.volume}
                                                    </Text>
                                                    <Text fontSize="xs" color="fg.muted">
                                                        Volume
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </HStack>
                                        <Box h="4px" bg="bg.muted" borderRadius="full" overflow="hidden">
                                            <Box
                                                h="100%"
                                                w={`${percentage}%`}
                                                bg={colors.main}
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </VStack>
                    ) : (
                        <Box p={8} textAlign="center">
                            <Text color="fg.muted">No category data available</Text>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Analysis Drawer - No insights for Analytics page */}
            <TrendAnalysisDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                productName={selectedCategory || ''}
                filters={{}}
                showInsights={false}
            />
        </Box>
    );
};

export default Analytics;
