import { useParams } from 'react-router-dom';
import { UserForm } from '../components/UserForm/UserForm';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services/userService';

export function EditPage() {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id || ''),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container">
      <h1>Editar Utilizador</h1>
      {user && <UserForm initialData={user} isEditMode />}
    </div>
  );
}