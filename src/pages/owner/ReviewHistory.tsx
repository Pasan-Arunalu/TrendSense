import {
    Box,
    Button,
    HStack,
    Text,
    Badge,
    Table,
    Select,
    Icon,
    createListCollection,
    Portal,
} from '@chakra-ui/react';
import { LuRefreshCw, LuCircleCheck, LuCircleX, LuFilter } from 'react-icons/lu';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useReviewHistory } from '@/hooks/useReviewHistory';

const statusFilter = createListCollection({
    items: [
        { label: 'All Status', value: 'all' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
    ],
});

export const ReviewHistory = () => {
    const { history, isLoading, handleFilterChange, refresh } = useReviewHistory();

    if (isLoading) {
        return <LoadingSpinner message="Loading review history..." />;
    }

    return (
        <Box>
            <PageHeader
                title="Review History"
                subtitle={`${history.length} reviewed items`}
                actions={
                    <HStack gap={2}>
                        <Box w="160px">
                            <Select.Root
                                collection={statusFilter}
                                defaultValue={['all']}
                                onValueChange={(e) => handleFilterChange(e.value[0] as 'all' | 'approved' | 'rejected')}
                                size="sm"
                            >
                                <Select.Trigger>
                                    <HStack>
                                        <Icon as={LuFilter} boxSize={4} color="fg.muted" />
                                        <Select.ValueText placeholder="Filter" />
                                    </HStack>
                                </Select.Trigger>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content bg="white" borderRadius="lg" shadow="lg">
                                            {statusFilter.items.map((item) => (
                                                <Select.Item key={item.value} item={item} _hover={{ bg: 'teal.50' }}>
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Box>
                        <Button variant="outline" size="sm" onClick={refresh}>
                            <LuRefreshCw />
                        </Button>
                    </HStack>
                }
            />

            {history.length === 0 ? (
                <EmptyState
                    title="No review history"
                    description="Reviewed items will appear here"
                />
            ) : (
                <Box bg="white" borderRadius="lg" border="1px solid" borderColor="teal.100" overflow="hidden">
                    <Table.Root size="md">
                        <Table.Header>
                            <Table.Row bg="teal.50">
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Product</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Attributes</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Status</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Reviewed By</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Date</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" fontFamily="heading">Batch</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {history.map((item) => (
                                <Table.Row key={item.item_id} _hover={{ bg: 'teal.50' }}>
                                    <Table.Cell fontWeight="medium" color="fg.DEFAULT">
                                        {item.product}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack gap={1} flexWrap="wrap">
                                            <Badge size="sm" colorScheme="blue">{item.color || 'N/A'}</Badge>
                                            <Badge size="sm" colorScheme="green">{item.fabric || 'N/A'}</Badge>
                                            <Badge size="sm" colorScheme="purple">{item.style || 'N/A'}</Badge>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            colorScheme={item.status === 'approved' ? 'green' : 'red'}
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                            w="fit-content"
                                        >
                                            <Icon
                                                as={item.status === 'approved' ? LuCircleCheck : LuCircleX}
                                                boxSize={3}
                                            />
                                            {item.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">
                                        {item.reviewed_by}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">
                                        {item.reviewed_at
                                            ? new Date(item.reviewed_at).toLocaleDateString()
                                            : '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontSize="sm" color="fg.muted" fontFamily="mono">
                                            {item.batch_id}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    );
};

export default ReviewHistory;
