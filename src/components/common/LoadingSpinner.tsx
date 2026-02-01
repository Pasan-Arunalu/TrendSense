import { Box, Spinner, Center } from '@chakra-ui/react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'lg',
    message = 'Loading...',
    fullScreen = false,
}) => {
    const content = (
        <Box textAlign="center">
            <Spinner
                size={size}
                color="purple.500"
                borderWidth="4px"
                css={{ animationDuration: '0.65s' }}
            />
            {message && (
                <Box mt={3} color="gray.600" fontWeight="medium" fontSize="sm">
                    {message}
                </Box>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Center h="100vh" bg="gray.50">
                {content}
            </Center>
        );
    }

    return (
        <Center py={12}>
            {content}
        </Center>
    );
};

export default LoadingSpinner;
