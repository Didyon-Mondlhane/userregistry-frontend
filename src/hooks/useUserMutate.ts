import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '../services/userService';
import { User } from '../types/User';
import { toast } from 'react-toastify';

export function useUserMutate() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: User }) => updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    }
  });

  return {
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
    error: createMutation.error || updateMutation.error
  };
}