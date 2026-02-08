import { Box, SimpleGrid, Text, VStack, HStack, Icon, Badge } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import { managerService } from '@/services/managerService';
import { ownerService } from '@/services/ownerService';
import {
    LuUsers,
    LuFileStack,
    LuCircleCheck,
    LuCircleX,
    LuClock,
    LuTrendingUp,
    LuSparkles,
    LuClipboardCheck,
} from 'react-icons/lu';
import type { AdminStats, ManagerStats, OwnerStats } from '@/types';

export const Dashboard = () => {
    const { user, hasRole } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
    const [managerStats, setManagerStats] = useState<ManagerStats | null>(null);
    const [ownerStats, setOwnerStats] = useState<OwnerStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);

                if (hasRole('admin')) {
                    const stats = await adminService.getStats();
                    setAdminStats(stats);
                }

                if (hasRole(['manager', 'admin'])) {
                    const stats = await managerService.getStats();
                    setManagerStats(stats);
                }

                if (hasRole(['owner', 'admin'])) {
                    const stats = await ownerService.getStats();
                    setOwnerStats(stats);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [hasRole]);

    if (isLoading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <Box>
            <PageHeader
                title={`${getGreeting()}, ${user?.username || 'User'}!`}
                subtitle="Here's what's happening with your trends today"
            />

            {/* Admin Stats */}
            {hasRole('admin') && adminStats && (
                <Box mb={8}>
                    <HStack mb={4}>
                        <Text fontSize="lg" fontWeight="semibold" color="fg.muted">
                            System Overview
                        </Text>
                        <Badge colorScheme="purple">Admin</Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                        <StatCard
                            title="Total Users"
                            value={adminStats.users.total}
                            subtitle={`${adminStats.users.active} active`}
                            icon={LuUsers}
                            colorScheme="purple"
                        />
                    </SimpleGrid>
                </Box>
            )}

            {/* Manager Stats */}
            {hasRole(['manager']) && managerStats && (
                <Box mb={8}>
                    <HStack mb={4}>
                        <Text fontSize="lg" fontWeight="semibold" color="fg.muted">
                            Prediction Analytics
                        </Text>
                        <Badge colorScheme="blue">Manager</Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                        <StatCard
                            title="My Batches"
                            value={managerStats.total_batches}
                            subtitle={`${managerStats.total_items} items generated`}
                            icon={LuSparkles}
                            colorScheme="blue"
                        />
                        <StatCard
                            title="Pending"
                            value={managerStats.items_by_status.pending}
                            icon={LuClock}
                            colorScheme="orange"
                        />
                        <StatCard
                            title="Approved"
                            value={managerStats.items_by_status.approved}
                            icon={LuCircleCheck}
                            colorScheme="green"
                        />
                        <StatCard
                            title="Approval Rate"
                            value={`${managerStats.approval_rate}%`}
                            icon={LuTrendingUp}
                            colorScheme="purple"
                        />
                    </SimpleGrid>
                </Box>
            )}

            {/* Owner Stats */}
            {hasRole(['owner']) && ownerStats && (
                <Box mb={8}>
                    <HStack mb={4}>
                        <Text fontSize="lg" fontWeight="semibold" color="fg.muted">
                            Review Statistics
                        </Text>
                        <Badge colorScheme="green">Owner</Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                        <StatCard
                            title="Total Items"
                            value={ownerStats.total_items}
                            icon={LuClipboardCheck}
                            colorScheme="green"
                        />
                        <StatCard
                            title="Pending Review"
                            value={ownerStats.items_by_status.pending}
                            icon={LuClock}
                            colorScheme="orange"
                        />
                        <StatCard
                            title="Approval Rate"
                            value={`${ownerStats.approval_rate}%`}
                            icon={LuCircleCheck}
                            colorScheme="green"
                        />
                        <StatCard
                            title="Rejection Rate"
                            value={`${ownerStats.rejection_rate}%`}
                            icon={LuCircleX}
                            colorScheme="red"
                        />
                    </SimpleGrid>
                </Box>
            )}

            {/* Quick Actions */}
            <Box>
                <Text fontSize="lg" fontWeight="semibold" color="fg.muted" mb={4}>
                    Quick Actions
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                    {hasRole('admin') && (
                        <QuickActionCard
                            icon={LuUsers}
                            title="Manage Users"
                            description="Add, edit, or remove users"
                            href="/admin/users"
                            color="purple"
                        />
                    )}
                    {hasRole(['manager']) && (
                        <QuickActionCard
                            icon={LuSparkles}
                            title="Generate Predictions"
                            description="Create new trend predictions"
                            href="/manager/generate"
                            color="blue"
                        />
                    )}
                    {hasRole(['owner']) && (
                        <QuickActionCard
                            icon={LuClipboardCheck}
                            title="Review Pending"
                            description="Approve or reject predictions"
                            href="/owner/pending"
                            color="green"
                        />
                    )}
                </SimpleGrid>
            </Box>
        </Box>
    );
};

// Quick Action Card Component
interface QuickActionCardProps {
    icon: any;
    title: string;
    description: string;
    href: string;
    color: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon: IconComponent,
    title,
    description,
    href,
    color,
}) => {
    const navigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <Box
            as="button"
            onClick={() => navigate(href)}
            bg="white"
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor="teal.50"
            display="flex"
            alignItems="flex-start"
            gap={4}
            textAlign="left"
            transition="all 0.2s"
            _hover={{
                shadow: 'md',
                borderColor: `${color}.200`,
                transform: 'translateY(-2px)',
            }}
        >
            <Box p={3} borderRadius="lg" bg={`${color}.50`}>
                <Icon as={IconComponent} boxSize={6} color={`${color}.500`} />
            </Box>
            <VStack align="start" gap={1}>
                <Text fontWeight="semibold" color="fg.DEFAULT">
                    {title}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                    {description}
                </Text>
            </VStack>
        </Box>
    );
};

export default Dashboard;
