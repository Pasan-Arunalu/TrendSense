import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ownerService } from '@/services/ownerService';
import type { PendingItem } from '@/types';

export const usePendingReview = () => {
    const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await ownerService.getPendingItems();
            setPendingItems(response.pending_items);
            setSelectedItems([]);
        } catch (error) {
            toast.error('Failed to fetch pending items');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingItems();
    }, [fetchPendingItems]);

    const toggleSelection = (itemId: number) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === pendingItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(pendingItems.map((item) => item.item_id));
        }
    };

    const handleAction = async (action: 'approve' | 'reject', itemIds: number[]) => {
        if (itemIds.length === 1) {
            await ownerService.updateStatus({ item_id: itemIds[0], action });
            toast.success(`Item ${action}d`);
        } else {
            await ownerService.batchUpdateStatus({ item_ids: itemIds, action });
            toast.success(`${itemIds.length} items ${action}d`);
        }
        fetchPendingItems();
    };

    return {
        pendingItems,
        selectedItems,
        isLoading,
        refresh: fetchPendingItems,
        toggleSelection,
        toggleSelectAll,
        handleAction,
    };
};
