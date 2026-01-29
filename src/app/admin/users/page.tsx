'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  MoreVertical,
  X,
  Eye,
  GraduationCap,
  Briefcase,
  Heart,
  Shield,
} from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { UserRole } from '@/types/user';
import { CreateUserInput, UpdateUserInput } from '@/types/admin';
import { cn } from '@/lib/utils/cn';

const roleIcons = {
  learner: GraduationCap,
  teacher: Briefcase,
  parent: Heart,
  admin: Shield,
};

const roleColors = {
  learner: 'bg-green-500/20 text-green-400 border-green-500/30',
  teacher: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  parent: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function UserManagementPage() {
  const searchParams = useSearchParams();
  const showCreateOnLoad = searchParams.get('action') === 'create';

  const { user: currentUser } = useAuthStore();
  const {
    users,
    selectedUser,
    filters,
    isLoading,
    error,
    successMessage,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    clearSelectedUser,
    clearMessages,
  } = useAdminStore();

  const [showCreateModal, setShowCreateModal] = useState(showCreateOnLoad);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<boolean | 'all'>('all');

  // Form state
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    password: '',
    displayName: '',
    role: 'learner',
    isActive: true,
  });
  const [editFormData, setEditFormData] = useState<UpdateUserInput>({});

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.isActive !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !user.displayName.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: 'learner',
        isActive: true,
      });
    } catch {
      // Error handled by store
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.uid, editFormData);
      setShowEditModal(false);
      clearSelectedUser();
    } catch {
      // Error handled by store
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.uid);
      setShowDeleteModal(false);
      clearSelectedUser();
    } catch {
      // Error handled by store
    }
  };

  const openEditModal = async (userId: string) => {
    const user = await fetchUserById(userId);
    if (user) {
      setEditFormData({
        displayName: user.displayName,
        role: user.role,
        isActive: user.isActive,
      });
      setShowEditModal(true);
    }
  };

  const openDeleteModal = async (userId: string) => {
    await fetchUserById(userId);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">
            Manage all user accounts across the platform
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-5 h-5" />}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600"
        >
          Create User
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 flex items-center justify-between"
        >
          <span>{successMessage}</span>
          <button onClick={clearMessages}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={clearMessages}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Roles</option>
                <option value="learner">Learners</option>
                <option value="teacher">Teachers</option>
                <option value="parent">Parents</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter === 'all' ? 'all' : statusFilter ? 'active' : 'inactive'}
              onChange={(e) => {
                if (e.target.value === 'all') setStatusFilter('all');
                else if (e.target.value === 'active') setStatusFilter(true);
                else setStatusFilter(false);
              }}
              className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-blue-400" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-400 text-sm">
                      User
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-400 text-sm">
                      Role
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-400 text-sm">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-400 text-sm">
                      Created
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-400 text-sm">
                      Last Login
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const RoleIcon = roleIcons[user.role];
                    return (
                      <motion.tr
                        key={user.uid}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {user.displayName}
                              </p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border capitalize',
                              roleColors[user.role]
                            )}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-400">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user.uid)}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.isActive ? (
                              <button
                                onClick={() => deactivateUser(user.uid)}
                                className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                                title="Deactivate"
                                disabled={user.uid === currentUser?.uid}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => activateUser(user.uid)}
                                className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="Activate"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => openDeleteModal(user.uid)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                              disabled={user.uid === currentUser?.uid}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-400">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No users have registered yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-red-500"
            >
              <option value="learner">Learner</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
              isLoading={isLoading}
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          clearSelectedUser();
        }}
        title="Edit User"
      >
        {selectedUser && (
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={editFormData.displayName || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, displayName: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email (read-only)
              </label>
              <input
                type="email"
                value={selectedUser.email}
                disabled
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={editFormData.role || selectedUser.role}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, role: e.target.value as UserRole })
                }
                disabled={selectedUser.uid === currentUser?.uid}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
              >
                <option value="learner">Learner</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
                onClick={() => {
                  setShowEditModal(false);
                  clearSelectedUser();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          clearSelectedUser();
        }}
        title="Delete User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400">
                Are you sure you want to delete{' '}
                <strong>{selectedUser.displayName}</strong>?
              </p>
              <p className="text-sm text-gray-400 mt-2">
                This action cannot be undone. All user data will be permanently
                removed.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300"
                onClick={() => {
                  setShowDeleteModal(false);
                  clearSelectedUser();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600"
                onClick={handleDeleteUser}
                isLoading={isLoading}
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
