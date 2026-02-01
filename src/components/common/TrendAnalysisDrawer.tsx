import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Badge,
    Button,
    SimpleGrid,
    Portal,
} from '@chakra-ui/react';
import { LuX, LuTrendingUp, LuPalette, LuShirt, LuSparkles } from 'react-icons/lu';
import { trendService } from '@/services/trendService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { AnalysisResponse, AnalysisFilters, PredictionFilters } from '@/types';

interface TrendAnalysisDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    filters: PredictionFilters;
    showInsights?: boolean;
}

export const TrendAnalysisDrawer = ({
    isOpen,
    onClose,
    productName,
    filters,
    showInsights = true,
}: TrendAnalysisDrawerProps) => {
    const [data, setData] = useState<AnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && productName) {
            fetchAnalysis();
        }
    }, [isOpen, productName]);

    const fetchAnalysis = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const analysisFilters: AnalysisFilters = {
                sub_category: productName,
                season: filters.season !== 'All' ? filters.season : undefined,
                gender: filters.gender !== 'All' ? filters.gender : undefined,
                age_group: filters.age_group !== 'All' ? filters.age_group : undefined,
                region: filters.region !== 'All' ? filters.region : undefined,
            };
            const result = await trendService.analyzeTrends(analysisFilters);
            if (result.error) {
                setError(result.error);
            } else {
                setData(result);
            }
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to load analysis');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate SVG path for curved line chart
    const generateCurvePath = (values: number[], width: number, height: number) => {
        if (!values || values.length < 2) return '';

        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const points = values.map((val, i) => ({
            x: padding + (i / (values.length - 1)) * chartWidth,
            y: padding + chartHeight - ((val - min) / range) * chartHeight
        }));

        // Create smooth curve using bezier curves
        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const tension = 0.3;
            const cp1x = p0.x + (p1.x - p0.x) * tension;
            const cp1y = p0.y;
            const cp2x = p1.x - (p1.x - p0.x) * tension;
            const cp2y = p1.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }

        return path;
    };

    if (!isOpen) return null;

    return (
        <Portal>
            {/* Backdrop */}
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.500"
                zIndex={1000}
                onClick={onClose}
            />

            {/* Drawer */}
            <Box
                position="fixed"
                top={0}
                right={0}
                bottom={0}
                w={{ base: '100%', md: '500px' }}
                bg="white"
                zIndex={1001}
                shadow="xl"
                overflowY="auto"
            >
                {/* Header */}
                <HStack justify="space-between" p={6} borderBottom="1px solid" borderColor="gray.100">
                    <VStack align="start" gap={1}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                            {productName} Analysis
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Trend insights and velocity data
                        </Text>
                    </VStack>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <LuX size={20} />
                    </Button>
                </HStack>

                {/* Content */}
                <Box p={6}>
                    {isLoading && <LoadingSpinner message="Analyzing trends..." />}

                    {error && (
                        <Box p={4} bg="red.50" borderRadius="lg" color="red.600">
                            <Text>{error}</Text>
                        </Box>
                    )}

                    {data && !isLoading && (
                        <VStack gap={6} align="stretch">
                            {/* Data Points Badge */}
                            <HStack>
                                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                                    {data.data_points} data points analyzed
                                </Badge>
                            </HStack>

                            {/* Trend Timeline - Curvy Line Chart */}
                            <Box bg="gray.50" borderRadius="lg" p={5}>
                                <HStack mb={4}>
                                    <LuTrendingUp color="#805AD5" />
                                    <Text fontWeight="semibold" color="gray.700">
                                        {data.chart_forecast.title}
                                    </Text>
                                </HStack>

                                {/* SVG Line Chart */}
                                <Box position="relative" h="180px" mb={4}>
                                    <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                                        {/* Grid lines */}
                                        <line x1="20" y1="160" x2="380" y2="160" stroke="#E2E8F0" strokeWidth="1" />
                                        <line x1="20" y1="90" x2="380" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                                        <line x1="20" y1="20" x2="380" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />

                                        {/* Area fill */}
                                        <path
                                            d={`${generateCurvePath(data.chart_forecast.values, 400, 180)} L 380 160 L 20 160 Z`}
                                            fill="url(#purpleGradient)"
                                            opacity="0.3"
                                        />

                                        {/* Line */}
                                        <path
                                            d={generateCurvePath(data.chart_forecast.values, 400, 180)}
                                            fill="none"
                                            stroke="#805AD5"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* Data points */}
                                        {data.chart_forecast.values.map((val, i) => {
                                            const max = Math.max(...data.chart_forecast.values);
                                            const min = Math.min(...data.chart_forecast.values);
                                            const range = max - min || 1;
                                            const x = 20 + (i / (data.chart_forecast.values.length - 1)) * 360;
                                            const y = 20 + 140 - ((val - min) / range) * 140;
                                            return (
                                                <g key={i}>
                                                    <circle cx={x} cy={y} r="6" fill="white" stroke="#805AD5" strokeWidth="2" />
                                                    <text x={x} y={y - 12} textAnchor="middle" fill="#805AD5" fontSize="10" fontWeight="600">
                                                        {val}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {/* Gradient definition */}
                                        <defs>
                                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#805AD5" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#805AD5" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </Box>

                                {/* X-axis labels */}
                                <HStack justify="space-between" px={2}>
                                    {data.chart_forecast.labels.map((label, i) => (
                                        <Text key={i} fontSize="xs" color="gray.500" textAlign="center">
                                            {label}
                                        </Text>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Style Velocity Chart */}
                            <Box bg="gray.50" borderRadius="lg" p={5}>
                                <HStack mb={4}>
                                    <LuSparkles color="#3182CE" />
                                    <Text fontWeight="semibold" color="gray.700">
                                        {data.chart_velocity.title}
                                    </Text>
                                </HStack>
                                <VStack gap={3} align="stretch">
                                    {data.chart_velocity.labels.map((label, i) => {
                                        const max = Math.max(...data.chart_velocity.scores);
                                        const pct = max > 0 ? (data.chart_velocity.scores[i] / max) * 100 : 0;
                                        return (
                                            <Box key={i}>
                                                <HStack justify="space-between" mb={1}>
                                                    <Text fontSize="sm" color="gray.600">{label}</Text>
                                                    <Text fontSize="sm" fontWeight="medium" color="blue.600">
                                                        {data.chart_velocity.scores[i].toFixed(1)}
                                                    </Text>
                                                </HStack>
                                                <Box h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box
                                                        h="100%"
                                                        w={`${pct}%`}
                                                        bg="blue.500"
                                                        borderRadius="full"
                                                        transition="width 0.3s"
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </VStack>
                            </Box>

                            {/* Insights - Only shown when showInsights is true */}
                            {showInsights && (
                                <Box bg="gray.50" borderRadius="lg" p={5}>
                                    <Text fontWeight="semibold" color="gray.700" mb={4}>
                                        Top Insights
                                    </Text>
                                    <SimpleGrid columns={1} gap={4}>
                                        {/* Top Colors */}
                                        <Box>
                                            <HStack mb={2}>
                                                <LuPalette color="#E53E3E" size={16} />
                                                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                    Top Colors
                                                </Text>
                                            </HStack>
                                            <HStack gap={2} flexWrap="wrap">
                                                {data.insights.colors.map((color, i) => (
                                                    <Badge key={i} colorScheme="red" variant="subtle">
                                                        {color}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>

                                        {/* Top Fabrics */}
                                        <Box>
                                            <HStack mb={2}>
                                                <LuShirt color="#38A169" size={16} />
                                                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                    Top Fabrics
                                                </Text>
                                            </HStack>
                                            <HStack gap={2} flexWrap="wrap">
                                                {data.insights.fabrics.map((fabric, i) => (
                                                    <Badge key={i} colorScheme="green" variant="subtle">
                                                        {fabric}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>

                                        {/* Top Styles */}
                                        <Box>
                                            <HStack mb={2}>
                                                <LuSparkles color="#805AD5" size={16} />
                                                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                                                    Top Styles
                                                </Text>
                                            </HStack>
                                            <HStack gap={2} flexWrap="wrap">
                                                {data.insights.styles.map((style, i) => (
                                                    <Badge key={i} colorScheme="purple" variant="subtle">
                                                        {style}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>
                                    </SimpleGrid>
                                </Box>
                            )}
                        </VStack>
                    )}
                </Box>
            </Box>
        </Portal>
    );
};

export default TrendAnalysisDrawer;
