import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <Flex minH="100vh" bg="bg.canvas">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <Box
                ml="260px"
                flex="1"
                minH="100vh"
                transition="margin-left 0.2s"
                p={8}
            >
                {/* Page Content */}
                <Box maxW="7xl" mx="auto">
                    {children || <Outlet />}
                </Box>
            </Box>
        </Flex>
    );
};

export default DashboardLayout;
