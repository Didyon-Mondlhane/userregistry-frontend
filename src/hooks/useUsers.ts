import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/userService';

export function useUsers(search = '', page = 1) {
  return useQuery({
    queryKey: ['users', search, page],
    queryFn: () => getUsers(search, page),
  });
}