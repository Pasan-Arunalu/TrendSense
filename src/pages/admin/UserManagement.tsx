import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    Badge,
    Dialog,
    Portal,
    CloseButton,
    Input,
    VStack,
    HStack,
    Text,
    Select,
    IconButton,
    createListCollection,
} from '@chakra-ui/react';
import { LuPlus, LuPencil, LuTrash2, LuRefreshCw } from 'react-icons/lu';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { adminService } from '@/services/adminService';
import type { User, UserRole, CreateUserRequest } from '@/types';

const roleOptions = createListCollection({
    items: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Owner', value: 'owner' },
    ],
});

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<CreateUserRequest>();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getUsers();
            setUsers(response.users);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openCreateModal = () => {
        setEditingUser(null);
        reset({ username: '', password: '', role: 'manager' });
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        reset({ username: user.username, password: '', role: user.role });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    const onSubmit = async (data: CreateUserRequest) => {
        try {
            setIsSubmitting(true);

            if (editingUser) {
                await adminService.updateUser(editingUser.id, {
                    role: data.role,
                    password: data.password || undefined,
                });
                toast.success('User updated successfully');
            } else {
                await adminService.createUser(data);
                toast.success('User created successfully');
            }

            closeModal();
            fetchUsers();
        } catch (error: any) {
            const msg = error.response?.data?.msg || 'Operation failed';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUser) return;

        try {
            setIsSubmitting(true);
            await adminService.deleteUser(deleteUser.id);
            toast.success('User deleted successfully');
            setDeleteUser(null);
            fetchUsers();
        } catch (error: any) {
            const msg = error.response?.data?.msg || 'Delete failed';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleUserStatus = async (user: User) => {
        try {
            await adminService.updateUser(user.id, { is_active: !user.is_active });
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`);
            fetchUsers();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'purple';
            case 'manager': return 'blue';
            case 'owner': return 'green';
            default: return 'gray';
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Loading users..." />;
    }

    return (
        <Box>
            <PageHeader
                title="User Management"
                subtitle={`${users.length} total users`}
                actions={
                    <HStack gap={2}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchUsers}
                        >
                            <LuRefreshCw />
                        </Button>
                        <Button
                            colorScheme="purple"
                            size="sm"
                            onClick={openCreateModal}
                        >
                            <LuPlus /> Add User
                        </Button>
                    </HStack>
                }
            />

            {users.length === 0 ? (
                <EmptyState
                    title="No users found"
                    description="Start by adding your first user"
                    action={
                        <Button colorScheme="purple" onClick={openCreateModal}>
                            <LuPlus /> Add User
                        </Button>
                    }
                />
            ) : (
                <Box bg="white" borderRadius="xl" border="1px solid" borderColor="teal.100" overflow="hidden">
                    <Table.Root size="md">
                        <Table.Header>
                            <Table.Row bg="teal.50">
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted">Username</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted">Role</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted">Status</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted">Created</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" color="fg.muted" textAlign="right">Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.map((user) => (
                                <Table.Row key={user.id} _hover={{ bg: 'teal.50' }}>
                                    <Table.Cell fontWeight="medium" color="fg.DEFAULT">{user.username}</Table.Cell>
                                    <Table.Cell>
                                        <Badge colorScheme={getRoleBadgeColor(user.role)} textTransform="capitalize">
                                            {user.role}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            colorScheme={user.is_active ? 'green' : 'red'}
                                            cursor="pointer"
                                            onClick={() => toggleUserStatus(user)}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <HStack gap={2} justify="flex-end">
                                            <IconButton
                                                aria-label="Edit user"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(user)}
                                            >
                                                <LuPencil />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete user"
                                                variant="ghost"
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => setDeleteUser(user)}
                                            >
                                                <LuTrash2 />
                                            </IconButton>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {/* Create/Edit Modal */}
            <Dialog.Root open={isModalOpen} onOpenChange={(e) => !e.open && closeModal()} placement="center">
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="white" p={6} maxW="md" borderRadius="xl">
                            <Dialog.Header pb={2}>
                                <Dialog.Title fontWeight="bold" fontSize="lg" color="gray.800">
                                    {editingUser ? 'Edit User' : 'Create User'}
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body py={4}>
                                <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
                                    <VStack gap={4}>
                                        <Box w="full">
                                            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                                                Username
                                            </Text>
                                            <Input
                                                {...register('username', { required: 'Username is required' })}
                                                placeholder="Enter username"
                                                disabled={!!editingUser}
                                                borderColor={errors.username ? 'red.300' : 'gray.200'}
                                            />
                                            {errors.username && (
                                                <Text color="red.500" fontSize="sm" mt={1}>{errors.username.message}</Text>
                                            )}
                                        </Box>

                                        <Box w="full">
                                            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                                                Password {editingUser && '(leave blank to keep current)'}
                                            </Text>
                                            <Input
                                                type="password"
                                                {...register('password', {
                                                    required: editingUser ? false : 'Password is required',
                                                    minLength: { value: 6, message: 'Min 6 characters' }
                                                })}
                                                placeholder={editingUser ? '••••••••' : 'Enter password'}
                                                borderColor={errors.password ? 'red.300' : 'gray.200'}
                                            />
                                            {errors.password && (
                                                <Text color="red.500" fontSize="sm" mt={1}>{errors.password.message}</Text>
                                            )}
                                        </Box>

                                        <Box w="full">
                                            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                                                Role
                                            </Text>
                                            <Select.Root
                                                collection={roleOptions}
                                                defaultValue={[editingUser?.role || 'manager']}
                                                onValueChange={(e) => setValue('role', e.value[0] as UserRole)}
                                            >
                                                <Select.Trigger>
                                                    <Select.ValueText placeholder="Select role" />
                                                </Select.Trigger>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {roleOptions.items.map((option) => (
                                                                <Select.Item key={option.value} item={option}>
                                                                    {option.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        </Box>
                                    </VStack>
                                </form>
                            </Dialog.Body>
                            <Dialog.Footer pt={4} display="flex" gap={3} justifyContent="flex-end">
                                <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    form="user-form"
                                    colorScheme="purple"
                                    loading={isSubmitting}
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={handleDelete}
                title="Delete User"
                description={`Are you sure you want to delete "${deleteUser?.username}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isSubmitting}
                variant="danger"
            />
        </Box>
    );
};

export default UserManagement;
