import { useState } from 'react';
import {
    Box,
    Button,
    VStack,
    HStack,
    Text,
    SimpleGrid,
    Select,
    Badge,
    createListCollection,
    Portal,
} from '@chakra-ui/react';
import { LuEye, LuSave, LuActivity } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TrendAnalysisDrawer } from '@/components/common/TrendAnalysisDrawer';
import { managerService } from '@/services/managerService';
import type { PreviewPredictionResponse, PredictionFilters } from '@/types';

const regionOptions = createListCollection({
    items: [
        { label: 'All Regions', value: 'All' },
        { label: 'North America', value: 'North America' },
        { label: 'Europe', value: 'Europe' },
        { label: 'Asia', value: 'Asia' },
        { label: 'South America', value: 'South America' },
    ],
});

const seasonOptions = createListCollection({
    items: [
        { label: 'All Seasons', value: 'All' },
        { label: 'Spring/Summer 26', value: 'SS26' },
        { label: 'Fall/Winter 26', value: 'FW26' },
        { label: 'Core/Evergreen', value: 'Core/Evergreen' },
    ],
});

const genderOptions = createListCollection({
    items: [
        { label: 'All Genders', value: 'All' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ],
});

const ageGroupOptions = createListCollection({
    items: [
        { label: 'All Ages', value: 'All' },
        { label: '18-24', value: '18-24' },
        { label: '25-34', value: '25-34' },
        { label: '35-44', value: '35-44' },
        { label: '45-54', value: '45-54' },
        { label: '55+', value: '55+' },
    ],
});

export const GeneratePrediction = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<PredictionFilters>({
        region: 'All',
        season: 'All',
        gender: 'All',
        age_group: 'All',
    });
    const [preview, setPreview] = useState<PreviewPredictionResponse | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Drawer state
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const updateFilter = (key: keyof PredictionFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPreview(null);
    };

    const handlePreview = async () => {
        try {
            setIsPreviewLoading(true);
            const result = await managerService.previewPrediction(filters);
            setPreview(result);
            if (result.count === 0) {
                toast.error('No trends found for these filters');
            }
        } catch (error: any) {
            const msg = error.response?.data?.msg || 'Preview failed';
            toast.error(msg);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setIsGenerating(true);
            const result = await managerService.generatePrediction(filters);
            toast.success(`Generated ${result.items_count} predictions!`);
            navigate('/manager/predictions');
        } catch (error: any) {
            const msg = error.response?.data?.msg || 'Generation failed';
            toast.error(msg);
        } finally {
            setIsGenerating(false);
        }
    };

    const openAnalysis = (productName: string) => {
        setSelectedProduct(productName);
        setIsDrawerOpen(true);
    };

    return (
        <Box>
            <PageHeader
                title="Generate Predictions"
                subtitle="Create new trend predictions based on data analysis"
            />

            {/* Filter Grid */}
            <Box bg="bg.subtle" borderRadius="lg" border="1px solid" borderColor="teal.200" p={6} mb={6}>
                <Text fontWeight="semibold" color="fg.DEFAULT" mb={4}>
                    Filter Parameters
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                    <Box>
                        <Text fontSize="sm" color="fg.muted" mb={2}>Region</Text>
                        <Select.Root
                            collection={regionOptions}
                            defaultValue={['All']}
                            onValueChange={(e) => updateFilter('region', e.value[0])}
                        >
                            <Select.Trigger bg="white">
                                <Select.ValueText placeholder="Select region" />
                            </Select.Trigger>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="white" borderRadius="lg" shadow="lg">
                                        {regionOptions.items.map((item) => (
                                            <Select.Item key={item.value} item={item} _hover={{ bg: 'teal.50' }}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box>
                        <Text fontSize="sm" color="fg.muted" mb={2}>Season</Text>
                        <Select.Root
                            collection={seasonOptions}
                            defaultValue={['All']}
                            onValueChange={(e) => updateFilter('season', e.value[0])}
                        >
                            <Select.Trigger bg="white">
                                <Select.ValueText placeholder="Select season" />
                            </Select.Trigger>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="white" borderRadius="lg" shadow="lg">
                                        {seasonOptions.items.map((item) => (
                                            <Select.Item key={item.value} item={item} _hover={{ bg: 'teal.50' }}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box>
                        <Text fontSize="sm" color="fg.muted" mb={2}>Gender</Text>
                        <Select.Root
                            collection={genderOptions}
                            defaultValue={['All']}
                            onValueChange={(e) => updateFilter('gender', e.value[0])}
                        >
                            <Select.Trigger bg="white">
                                <Select.ValueText placeholder="Select gender" />
                            </Select.Trigger>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="white" borderRadius="lg" shadow="lg">
                                        {genderOptions.items.map((item) => (
                                            <Select.Item key={item.value} item={item} _hover={{ bg: 'teal.50' }}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>

                    <Box>
                        <Text fontSize="sm" color="fg.muted" mb={2}>Age Group</Text>
                        <Select.Root
                            collection={ageGroupOptions}
                            defaultValue={['All']}
                            onValueChange={(e) => updateFilter('age_group', e.value[0])}
                        >
                            <Select.Trigger bg="white">
                                <Select.ValueText placeholder="Select age group" />
                            </Select.Trigger>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content bg="white" borderRadius="lg" shadow="lg">
                                        {ageGroupOptions.items.map((item) => (
                                            <Select.Item key={item.value} item={item} _hover={{ bg: 'teal.50' }}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Box>
                </SimpleGrid>

                <HStack mt={6} gap={4}>
                    <Button
                        colorScheme="gray"
                        variant="outline"
                        bg="white"
                        borderColor="teal.200"
                        _hover={{ bg: 'teal.50' }}
                        onClick={handlePreview}
                        loading={isPreviewLoading}
                    >
                        <LuEye /> Preview Results
                    </Button>
                    <Button
                        bg="primary.solid"
                        color="white"
                        _hover={{ bg: 'salmon.400' }}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        disabled={!preview || preview.count === 0}
                    >
                        <LuSave /> Generate & Save
                    </Button>
                </HStack>
            </Box>

            {/* Preview Results */}
            {isPreviewLoading && <LoadingSpinner message="Previewing results..." />}

            {preview && preview.count > 0 && (
                <Box bg="bg.subtle" borderRadius="lg" border="1px solid" borderColor="teal.200" p={6}>
                    <HStack justify="space-between" mb={4}>
                        <Text fontWeight="semibold" color="fg.DEFAULT">
                            Preview Results
                        </Text>
                        <Badge colorScheme="purple" fontSize="sm">
                            {preview.count} items
                        </Badge>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                        {preview.results.slice(0, 9).map((item, index) => (
                            <Box
                                key={index}
                                p={4}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="teal.100"
                                bg="white"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: 'salmon.300',
                                    shadow: 'md',
                                    transform: 'translateY(-2px)'
                                }}
                                onClick={() => openAnalysis(item.product)}
                            >
                                <HStack justify="space-between" mb={2}>
                                    <Text fontWeight="semibold" color="fg.DEFAULT">
                                        {item.product}
                                    </Text>
                                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                                        <LuActivity size={12} /> View
                                    </Badge>
                                </HStack>
                                <VStack align="start" gap={1} fontSize="sm">
                                    <HStack>
                                        <Text color="fg.muted">Color:</Text>
                                        <Badge colorScheme="blue">{item.color || 'N/A'}</Badge>
                                    </HStack>
                                    <HStack>
                                        <Text color="fg.muted">Fabric:</Text>
                                        <Badge colorScheme="green">{item.fabric || 'N/A'}</Badge>
                                    </HStack>
                                    <HStack>
                                        <Text color="fg.muted">Style:</Text>
                                        <Badge colorScheme="purple">{item.style || 'N/A'}</Badge>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </SimpleGrid>

                    {preview.count > 9 && (
                        <Text mt={4} textAlign="center" color="fg.muted" fontSize="sm">
                            Showing 9 of {preview.count} results
                        </Text>
                    )}
                </Box>
            )}

            {/* Analysis Drawer */}
            <TrendAnalysisDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                productName={selectedProduct || ''}
                filters={filters}
            />
        </Box>
    );
};

export default GeneratePrediction;
