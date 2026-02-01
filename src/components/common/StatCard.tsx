import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: IconType;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    colorScheme?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

const colorMap = {
    purple: { bg: 'purple.50', border: 'purple.200', icon: 'purple.500' },
    blue: { bg: 'blue.50', border: 'blue.200', icon: 'blue.500' },
    green: { bg: 'green.50', border: 'green.200', icon: 'green.500' },
    orange: { bg: 'orange.50', border: 'orange.200', icon: 'orange.500' },
    red: { bg: 'red.50', border: 'red.200', icon: 'red.500' },
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon: IconComponent,
    trend,
    colorScheme = 'purple',
}) => {
    const colors = colorMap[colorScheme];

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            border="1px solid"
            borderColor="teal.100"
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: 'md', borderColor: colors.border }}
        >
            <Flex justify="space-between" align="flex-start">
                <Box>
                    <Text color="fg.muted" fontSize="sm" fontWeight="medium" mb={1}>
                        {title}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="fg.DEFAULT">
                        {value}
                    </Text>
                    {subtitle && (
                        <Text color="fg.muted" fontSize="sm" mt={1}>
                            {subtitle}
                        </Text>
                    )}
                    {trend && (
                        <Flex align="center" mt={2}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={trend.isPositive ? 'green.500' : 'red.500'}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </Text>
                            <Text fontSize="sm" color="fg.muted" ml={2}>
                                vs last period
                            </Text>
                        </Flex>
                    )}
                </Box>
                {IconComponent && (
                    <Box
                        p={3}
                        borderRadius="lg"
                        bg={colors.bg}
                    >
                        <Icon as={IconComponent} boxSize={6} color={colors.icon} />
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default StatCard;
