import { useState } from 'react';
import {
    Box,
    Button,
    HStack,
    VStack,
    Text,
    Badge,
    Checkbox,
    SimpleGrid,
} from '@chakra-ui/react';
import { LuRefreshCw, LuCircleCheck, LuCircleX, LuClock } from 'react-icons/lu';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePendingReview } from '@/hooks/usePendingReview';

export const PendingReview = () => {
    const {
        pendingItems,
        selectedItems,
        isLoading,
        refresh,
        toggleSelection,
        toggleSelectAll,
        handleAction,
    } = usePendingReview();

    const [isBatchAction, setIsBatchAction] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'approve' | 'reject';
        itemId?: number;
        isBatch: boolean;
    } | null>(null);

    const onConfirmAction = async () => {
        if (!confirmAction) return;
        try {
            setIsBatchAction(true);
            const itemIds = confirmAction.isBatch ? selectedItems : [confirmAction.itemId!];
            await handleAction(confirmAction.type, itemIds);
            setConfirmAction(null);
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsBatchAction(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading pending items..." />;
    }

    return (
        <Box>
            <PageHeader
                title="Pending Review"
                subtitle={`${pendingItems.length} items awaiting review`}
                actions={
                    <Button variant="outline" size="sm" onClick={refresh}>
                        <LuRefreshCw />
                    </Button>
                }
            />

            {/* Batch Actions */}
            {pendingItems.length > 0 && (
                <Box bg="white" borderRadius="lg" border="1px solid" borderColor="teal.100" p={4} mb={4}>
                    <HStack justify="space-between">
                        <HStack gap={4}>
                            <Checkbox.Root
                                checked={selectedItems.length === pendingItems.length}
                                onCheckedChange={toggleSelectAll}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control borderColor="teal.200" borderRadius="md">
                                    <Checkbox.Indicator>
                                        <LuCircleCheck size={14} />
                                    </Checkbox.Indicator>
                                </Checkbox.Control>
                                <Checkbox.Label ml={2} color="fg.muted">
                                    Select All ({selectedItems.length}/{pendingItems.length})
                                </Checkbox.Label>
                            </Checkbox.Root>
                        </HStack>

                        {selectedItems.length > 0 && (
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    colorScheme="green"
                                    onClick={() => setConfirmAction({ type: 'approve', isBatch: true })}
                                >
                                    <LuCircleCheck /> Approve ({selectedItems.length})
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={() => setConfirmAction({ type: 'reject', isBatch: true })}
                                >
                                    <LuCircleX /> Reject ({selectedItems.length})
                                </Button>
                            </HStack>
                        )}
                    </HStack>
                </Box>
            )}

            {/* Items Grid */}
            {pendingItems.length === 0 ? (
                <EmptyState
                    icon={LuClock}
                    title="No pending items"
                    description="All predictions have been reviewed"
                />
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                    {pendingItems.map((item) => (
                        <Box
                            key={item.item_id}
                            bg="white"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={selectedItems.includes(item.item_id) ? 'salmon.300' : 'teal.100'}
                            p={5}
                            _hover={{ borderColor: 'salmon.200' }}
                        >
                            <HStack justify="space-between" mb={3}>
                                <Checkbox.Root
                                    checked={selectedItems.includes(item.item_id)}
                                    onCheckedChange={() => toggleSelection(item.item_id)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control borderColor="teal.200" borderRadius="md">
                                        <Checkbox.Indicator>
                                            <LuCircleCheck size={14} />
                                        </Checkbox.Indicator>
                                    </Checkbox.Control>
                                </Checkbox.Root>
                                <Badge colorScheme="orange" size="sm">
                                    <LuClock size={12} /> Pending
                                </Badge>
                            </HStack>

                            <Text fontWeight="semibold" color="fg.DEFAULT" fontSize="lg" mb={2}>
                                {item.product}
                            </Text>

                            <VStack align="start" gap={2} mb={4}>
                                <HStack>
                                    <Text fontSize="sm" color="fg.muted" w="60px">Color:</Text>
                                    <Badge colorScheme="blue">{item.color || 'N/A'}</Badge>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="fg.muted" w="60px">Fabric:</Text>
                                    <Badge colorScheme="green">{item.fabric || 'N/A'}</Badge>
                                </HStack>
                                <HStack>
                                    <Text fontSize="sm" color="fg.muted" w="60px">Style:</Text>
                                    <Badge colorScheme="purple">{item.style || 'N/A'}</Badge>
                                </HStack>
                            </VStack>

                            <Box borderTop="1px solid" borderColor="teal.50" pt={3} mb={4}>
                                <Text fontSize="xs" color="fg.muted" mb={1}>Context</Text>
                                <HStack gap={2} flexWrap="wrap">
                                    <Badge size="sm" variant="outline">{item.context.region}</Badge>
                                    <Badge size="sm" variant="outline">{item.context.season}</Badge>
                                </HStack>
                            </Box>

                            <Text fontSize="xs" color="fg.muted" mb={3}>
                                By {item.created_by} • {item.batch_id}
                            </Text>

                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    colorScheme="green"
                                    flex={1}
                                    onClick={() => setConfirmAction({ type: 'approve', itemId: item.item_id, isBatch: false })}
                                >
                                    <LuCircleCheck /> Approve
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="outline"
                                    flex={1}
                                    onClick={() => setConfirmAction({ type: 'reject', itemId: item.item_id, isBatch: false })}
                                >
                                    <LuCircleX /> Reject
                                </Button>
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            <ConfirmDialog
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={onConfirmAction}
                title={confirmAction?.type === 'approve' ? 'Approve Items' : 'Reject Items'}
                description={
                    confirmAction?.isBatch
                        ? `Are you sure you want to ${confirmAction?.type} ${selectedItems.length} selected items?`
                        : `Are you sure you want to ${confirmAction?.type} this item?`
                }
                confirmText={confirmAction?.type === 'approve' ? 'Approve' : 'Reject'}
                isLoading={isBatchAction}
                variant={confirmAction?.type === 'approve' ? 'info' : 'warning'}
            />
        </Box>
    );
};

export default PendingReview;
