import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { LuInbox } from 'react-icons/lu';

interface EmptyStateProps {
    icon?: IconType;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: IconComponent = LuInbox,
    title,
    description,
    action,
}) => {
    return (
        <VStack py={16} px={4} gap={4}>
            <Box
                p={4}
                borderRadius="full"
                bg="gray.100"
            >
                <Icon as={IconComponent} boxSize={10} color="gray.400" />
            </Box>
            <VStack gap={2} textAlign="center">
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    {title}
                </Text>
                {description && (
                    <Text color="gray.500" maxW="sm">
                        {description}
                    </Text>
                )}
            </VStack>
            {action && <Box mt={4}>{action}</Box>}
        </VStack>
    );
};

export default EmptyState;
