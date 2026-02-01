import { Box, Flex, Text, Icon, Input, Badge } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';
import { LuSearch, LuBell } from 'react-icons/lu';
import type { UserRole } from '@/types';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showSearch?: boolean;
    onSearch?: (query: string) => void;
    actions?: React.ReactNode;
}

const roleColors: Record<UserRole, string> = {
    admin: 'purple',
    manager: 'blue',
    owner: 'green',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    showSearch = false,
    onSearch,
    actions,
}) => {
    const { user } = useAuth();

    return (
        <Box mb={8}>
            <Flex justify="space-between" align="center" mb={2}>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text color="gray.500" mt={1}>
                            {subtitle}
                        </Text>
                    )}
                </Box>

                <Flex align="center" gap={4}>
                    {showSearch && (
                        <Box position="relative" maxW="300px">
                            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2}>
                                <Icon as={LuSearch} color="gray.400" />
                            </Box>
                            <Input
                                pl={10}
                                placeholder="Search..."
                                bg="white"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="lg"
                                color="gray.600"
                                _placeholder={{ color: 'gray.400' }}
                                _focus={{ borderColor: 'purple.400', shadow: 'sm' }}
                                onChange={(e) => onSearch?.(e.target.value)}
                            />
                        </Box>
                    )}

                    {actions}

                    {/* Notifications */}
                    <Box
                        p={2}
                        borderRadius="lg"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        cursor="pointer"
                        _hover={{ borderColor: 'gray.300' }}
                    >
                        <Icon as={LuBell} color="gray.600" boxSize={5} />
                    </Box>

                    {/* User badge */}
                    {user && (
                        <Flex align="center" gap={2} bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200">
                            <Box
                                w={8}
                                h={8}
                                borderRadius="full"
                                bg={`${roleColors[user.role]}.100`}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontWeight="bold"
                                    fontSize="sm"
                                    color={`${roleColors[user.role]}.600`}
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </Text>
                            </Box>
                            <Box display={{ base: 'none', md: 'block' }}>
                                <Text fontWeight="medium" fontSize="sm" color="gray.800">
                                    {user.username}
                                </Text>
                                <Badge
                                    colorScheme={roleColors[user.role]}
                                    size="sm"
                                    textTransform="capitalize"
                                    fontSize="10px"
                                >
                                    {user.role}
                                </Badge>
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default PageHeader;
