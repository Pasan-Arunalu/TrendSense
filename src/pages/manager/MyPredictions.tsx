import { useState } from 'react';
import {
    Box,
    Button,
    HStack,
    Text,
    Badge,
    Accordion,
    VStack,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import { LuRefreshCw, LuTrash2, LuClock, LuCircleCheck, LuCircleX, LuChevronDown } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePredictions } from '@/hooks/usePredictions';
import type { PredictionBatch } from '@/types';

const statusConfig = {
    pending: { color: 'orange', icon: LuClock },
    approved: { color: 'green', icon: LuCircleCheck },
    rejected: { color: 'red', icon: LuCircleX },
};

export const MyPredictions = () => {
    const { predictions, isLoading, refresh, deletePrediction } = usePredictions();
    const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteBatchId) return;
        try {
            setIsDeleting(true);
            await deletePrediction(deleteBatchId);
            setDeleteBatchId(null);
        } catch (error: any) {
            const msg = error.response?.data?.msg || 'Delete failed';
            toast.error(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusCounts = (batch: PredictionBatch) => {
        if (!batch.items) return { pending: 0, approved: 0, rejected: 0 };
        return {
            pending: batch.items.filter((i) => i.status === 'pending').length,
            approved: batch.items.filter((i) => i.status === 'approved').length,
            rejected: batch.items.filter((i) => i.status === 'rejected').length,
        };
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading predictions..." />;
    }

    return (
        <Box>
            <PageHeader
                title="My Predictions"
                subtitle={`${predictions.length} prediction batches`}
                actions={
                    <Button variant="outline" size="sm" onClick={refresh}>
                        <LuRefreshCw />
                    </Button>
                }
            />

            {predictions.length === 0 ? (
                <EmptyState
                    title="No predictions yet"
                    description="Generate your first prediction batch to get started"
                />
            ) : (
                <VStack gap={4} align="stretch">
                    {predictions.map((batch) => {
                        const counts = getStatusCounts(batch);
                        return (
                            <Accordion.Root key={batch.uni_id} collapsible>
                                <Accordion.Item value={batch.uni_id}>
                                    <Box
                                        bg="white"
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor="teal.100"
                                        overflow="hidden"
                                    >
                                        <Accordion.ItemTrigger
                                            p={5}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            cursor="pointer"
                                            _hover={{ bg: 'teal.50' }}
                                        >
                                            <HStack gap={4} flex={1}>
                                                <Box>
                                                    <Text fontWeight="semibold" color="fg.DEFAULT">
                                                        {batch.uni_id}
                                                    </Text>
                                                    <Text fontSize="sm" color="fg.muted">
                                                        {batch.created_at
                                                            ? new Date(batch.created_at).toLocaleDateString()
                                                            : 'Unknown date'}
                                                    </Text>
                                                </Box>
                                                <HStack gap={2}>
                                                    <Badge colorScheme="blue">{batch.region}</Badge>
                                                    <Badge colorScheme="green">{batch.season}</Badge>
                                                </HStack>
                                            </HStack>

                                            <HStack gap={4}>
                                                <HStack gap={2}>
                                                    <Badge colorScheme="orange" display="flex" alignItems="center" gap={1}>
                                                        <LuClock size={12} /> {counts.pending}
                                                    </Badge>
                                                    <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                                                        <LuCircleCheck size={12} /> {counts.approved}
                                                    </Badge>
                                                    <Badge colorScheme="red" display="flex" alignItems="center" gap={1}>
                                                        <LuCircleX size={12} /> {counts.rejected}
                                                    </Badge>
                                                </HStack>
                                                <Accordion.ItemIndicator>
                                                    <LuChevronDown />
                                                </Accordion.ItemIndicator>
                                            </HStack>
                                        </Accordion.ItemTrigger>

                                        <Accordion.ItemContent>
                                            <Box p={5} borderTop="1px solid" borderColor="teal.50">
                                                <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={4}>
                                                    <Box>
                                                        <Text fontSize="xs" color="fg.muted">Region</Text>
                                                        <Text fontWeight="medium" color="fg.DEFAULT">{batch.region || 'All'}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text fontSize="xs" color="fg.muted">Season</Text>
                                                        <Text fontWeight="medium" color="fg.DEFAULT">{batch.season || 'All'}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text fontSize="xs" color="fg.muted">Gender</Text>
                                                        <Text fontWeight="medium" color="fg.DEFAULT">{batch.gender || 'All'}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text fontSize="xs" color="fg.muted">Age Group</Text>
                                                        <Text fontWeight="medium" color="fg.DEFAULT">{batch.age_group || 'All'}</Text>
                                                    </Box>
                                                </SimpleGrid>

                                                {batch.items && batch.items.length > 0 && (
                                                    <Box mb={4}>
                                                        <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={3}>
                                                            Items ({batch.items.length})
                                                        </Text>
                                                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
                                                            {batch.items.slice(0, 6).map((item) => {
                                                                const config = statusConfig[item.status as keyof typeof statusConfig];
                                                                return (
                                                                    <Box
                                                                        key={item.id}
                                                                        p={3}
                                                                        borderRadius="lg"
                                                                        border="1px solid"
                                                                        borderColor="teal.100"
                                                                        bg="bg.subtle"
                                                                    >
                                                                        <HStack justify="space-between" mb={2}>
                                                                            <Text fontWeight="medium" fontSize="sm" color="fg.DEFAULT">
                                                                                {item.product}
                                                                            </Text>
                                                                            <Badge colorScheme={config.color} size="sm">
                                                                                <Icon as={config.icon} boxSize={3} mr={1} />
                                                                                {item.status}
                                                                            </Badge>
                                                                        </HStack>
                                                                        <HStack gap={2} flexWrap="wrap">
                                                                            <Badge size="sm">{item.color}</Badge>
                                                                            <Badge size="sm">{item.fabric}</Badge>
                                                                            <Badge size="sm">{item.style}</Badge>
                                                                        </HStack>
                                                                    </Box>
                                                                );
                                                            })}
                                                        </SimpleGrid>
                                                        {batch.items.length > 6 && (
                                                            <Text mt={2} fontSize="sm" color="fg.muted">
                                                                +{batch.items.length - 6} more items
                                                            </Text>
                                                        )}
                                                    </Box>
                                                )}

                                                <HStack justify="flex-end">
                                                    {counts.pending === 0 && counts.approved === 0 && counts.rejected === 0 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            colorScheme="red"
                                                            onClick={() => setDeleteBatchId(batch.uni_id)}
                                                        >
                                                            <LuTrash2 /> Delete
                                                        </Button>
                                                    )}
                                                </HStack>
                                            </Box>
                                        </Accordion.ItemContent>
                                    </Box>
                                </Accordion.Item>
                            </Accordion.Root>
                        );
                    })}
                </VStack>
            )}

            <ConfirmDialog
                isOpen={!!deleteBatchId}
                onClose={() => setDeleteBatchId(null)}
                onConfirm={handleDelete}
                title="Delete Prediction Batch"
                description="Are you sure you want to delete this prediction batch? This action cannot be undone."
                confirmText="Delete"
                isLoading={isDeleting}
                variant="danger"
            />
        </Box>
    );
};

export default MyPredictions;
