import {
    Dialog,
    Button,
    Portal,
    CloseButton,
} from '@chakra-ui/react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}) => {
    const confirmColorScheme = variant === 'danger' ? 'red' : variant === 'warning' ? 'orange' : 'purple';

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" p={6} maxW="md" borderRadius="xl">
                        <Dialog.Header pb={2}>
                            <Dialog.Title fontWeight="bold" fontSize="lg" color="gray.800">
                                {title}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body py={4}>
                            <Dialog.Description color="gray.600">
                                {description}
                            </Dialog.Description>
                        </Dialog.Body>
                        <Dialog.Footer pt={4} display="flex" gap={3} justifyContent="flex-end">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                colorScheme={confirmColorScheme}
                                onClick={onConfirm}
                                loading={isLoading}
                            >
                                {confirmText}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ConfirmDialog;
