import { useState, useRef } from 'react';
import {
    Box,
    Button,
    VStack,
    Text,
    Icon,
    HStack,
    Progress,
} from '@chakra-ui/react';
import { LuUpload, LuFile, LuCircleCheck, LuCircleX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { adminService } from '@/services/adminService';
import type { UploadCsvResponse } from '@/types';

export const DataUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadCsvResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                toast.error('Please select a CSV file');
                return;
            }
            setFile(selectedFile);
            setUploadResult(null);
            setError(null);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            if (!droppedFile.name.endsWith('.csv')) {
                toast.error('Please drop a CSV file');
                return;
            }
            setFile(droppedFile);
            setUploadResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);
            const result = await adminService.uploadCsv(file);
            setUploadResult(result);
            toast.success(result.msg);
        } catch (err: any) {
            const errorMsg = err.response?.data?.msg || 'Upload failed';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setUploadResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box>
            <PageHeader
                title="Data Upload"
                subtitle="Upload CSV files to update trend data"
            />

            {/* Upload Area */}
            <Box
                bg="white"
                borderRadius="xl"
                border="2px dashed"
                borderColor={file ? 'purple.300' : 'gray.200'}
                p={12}
                textAlign="center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                transition="all 0.2s"
                _hover={{ borderColor: 'purple.400' }}
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <VStack gap={4}>
                    <Box
                        p={4}
                        borderRadius="full"
                        bg={file ? 'purple.50' : 'gray.100'}
                    >
                        <Icon
                            as={file ? LuFile : LuUpload}
                            boxSize={10}
                            color={file ? 'purple.500' : 'gray.400'}
                        />
                    </Box>

                    {file ? (
                        <>
                            <Text fontWeight="medium" color="gray.800">
                                {file.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                {(file.size / 1024).toFixed(2)} KB
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text fontWeight="medium" color="gray.800">
                                Drop your CSV file here
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                or click to browse
                            </Text>
                        </>
                    )}
                </VStack>
            </Box>

            {/* Upload Button */}
            {file && !uploadResult && (
                <HStack mt={6} gap={4}>
                    <Button
                        colorScheme="purple"
                        size="lg"
                        onClick={handleUpload}
                        loading={isUploading}
                        loadingText="Uploading..."
                        flex={1}
                    >
                        <LuUpload /> Upload & Process
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={clearFile}
                        disabled={isUploading}
                    >
                        Clear
                    </Button>
                </HStack>
            )}

            {/* Progress */}
            {isUploading && (
                <Box mt={6}>
                    <Progress.Root>
                        <Progress.Track>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                    <Text mt={2} fontSize="sm" color="gray.500" textAlign="center">
                        Processing data pipeline...
                    </Text>
                </Box>
            )}

            {/* Success Result */}
            {uploadResult && uploadResult.status === 'success' && (
                <Box
                    mt={6}
                    p={6}
                    bg="green.50"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="green.200"
                >
                    <HStack mb={4}>
                        <Icon as={LuCircleCheck} color="green.500" boxSize={6} />
                        <Text fontWeight="semibold" color="green.700">
                            Upload Successful
                        </Text>
                    </HStack>
                    <Text color="green.700" mb={4}>
                        {uploadResult.msg}
                    </Text>
                    {uploadResult.data_summary && (
                        <VStack align="start" gap={2} fontSize="sm" color="green.600">
                            {uploadResult.data_summary.total_records && (
                                <Text>• Total Records: {uploadResult.data_summary.total_records}</Text>
                            )}
                            {uploadResult.data_summary.regions && (
                                <Text>• Regions: {uploadResult.data_summary.regions.join(', ')}</Text>
                            )}
                            {uploadResult.data_summary.seasons && (
                                <Text>• Seasons: {uploadResult.data_summary.seasons.join(', ')}</Text>
                            )}
                        </VStack>
                    )}
                    <Button mt={4} colorScheme="green" variant="outline" onClick={clearFile}>
                        Upload Another File
                    </Button>
                </Box>
            )}

            {/* Error Result */}
            {error && (
                <Box
                    mt={6}
                    p={6}
                    bg="red.50"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="red.200"
                >
                    <HStack mb={4}>
                        <Icon as={LuCircleX} color="red.500" boxSize={6} />
                        <Text fontWeight="semibold" color="red.700">
                            Upload Failed
                        </Text>
                    </HStack>
                    <Text color="red.700">{error}</Text>
                    <Button mt={4} colorScheme="red" variant="outline" onClick={clearFile}>
                        Try Again
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default DataUpload;
