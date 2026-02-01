import { Box, VStack, Text, Flex, Icon, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    LuLayoutDashboard,
    LuUsers,
    LuUpload,
    LuSparkles,
    LuFileStack,
    LuClipboardCheck,
    LuHistory,
    LuTrendingUp,
    LuLogOut,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { UserRole } from '@/types';

interface NavItem {
    label: string;
    path: string;
    icon: IconType;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LuLayoutDashboard, roles: ['admin', 'manager', 'owner'] },
    { label: 'Analytics', path: '/analytics', icon: LuTrendingUp, roles: ['admin', 'manager', 'owner'] },
    // Admin items
    { label: 'Users', path: '/admin/users', icon: LuUsers, roles: ['admin'] },
    { label: 'Data Upload', path: '/admin/upload', icon: LuUpload, roles: ['admin'] },
    // Manager items
    { label: 'Generate', path: '/manager/generate', icon: LuSparkles, roles: ['manager', 'admin'] },
    { label: 'My Predictions', path: '/manager/predictions', icon: LuFileStack, roles: ['manager', 'admin'] },
    // Owner items
    { label: 'Pending Review', path: '/owner/pending', icon: LuClipboardCheck, roles: ['owner', 'admin'] },
    { label: 'Review History', path: '/owner/history', icon: LuHistory, roles: ['owner', 'admin'] },
];

interface SidebarProps {
    isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const filteredNavItems = navItems.filter((item) =>
        hasRole(item.roles)
    );

    const handleNavClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'purple';
            case 'manager': return 'blue';
            case 'owner': return 'green';
            default: return 'gray';
        }
    };

    return (
        <Box
            w={isCollapsed ? '80px' : '260px'}
            h="100vh"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.100"
            position="fixed"
            left={0}
            top={0}
            transition="width 0.2s"
            zIndex={100}
        >
            <Flex direction="column" h="full" py={6}>
                {/* Logo */}
                <Box px={6} mb={8}>
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="purple.600"
                        letterSpacing="-0.5px"
                    >
                        {isCollapsed ? 'TS' : 'TrendSense'}
                    </Text>
                </Box>

                {/* Navigation */}
                <VStack gap={1} flex={1} px={3} align="stretch">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Box
                                key={item.path}
                                as="button"
                                onClick={() => handleNavClick(item.path)}
                                py={3}
                                px={4}
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                gap={3}
                                bg={isActive ? 'purple.50' : 'transparent'}
                                color={isActive ? 'purple.600' : 'gray.600'}
                                fontWeight={isActive ? 'semibold' : 'medium'}
                                transition="all 0.15s"
                                _hover={{
                                    bg: isActive ? 'purple.50' : 'gray.50',
                                    color: isActive ? 'purple.600' : 'gray.800',
                                }}
                            >
                                <Icon as={item.icon} boxSize={5} />
                                {!isCollapsed && <Text fontSize="sm">{item.label}</Text>}
                            </Box>
                        );
                    })}
                </VStack>

                {/* User section */}
                <Box px={4} pt={4} borderTop="1px solid" borderColor="gray.100">
                    {!isCollapsed && user && (
                        <Box mb={4} px={2}>
                            <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                {user.username}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={`${getRoleBadgeColor(user.role)}.500`}
                                fontWeight="medium"
                                textTransform="capitalize"
                            >
                                {user.role}
                            </Text>
                        </Box>
                    )}
                    <Button
                        w="full"
                        variant="ghost"
                        color="gray.600"
                        justifyContent={isCollapsed ? 'center' : 'flex-start'}
                        onClick={handleLogout}
                        _hover={{ bg: 'red.50', color: 'red.500' }}
                    >
                        <Icon as={LuLogOut} boxSize={5} />
                        {!isCollapsed && <Text ml={3} fontSize="sm">Logout</Text>}
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
};

export default Sidebar;
