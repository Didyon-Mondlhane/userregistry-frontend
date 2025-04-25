import { useState } from 'react';
import { UserCard } from '../components/UserCard/UserCard';
import { useUsers } from '../hooks/useUsers';
import { Pagination } from '../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import './UsersPage.css';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUsers(search, page);

  return (
    <div className="users-container">
      <div className="header">
        <h1>Lista de Utilizadores</h1>
        <Link to="/register" className="btn-new-user">
          Novo Utilizador
        </Link>
      </div>

      <input
        type="text"
        placeholder="Pesquisar..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="user-list">
          {users?.data.map((user) => (
            <UserCard
              key={user.id}
              nomeCompleto={`${user.nome} ${user.apelido}`}
              email={user.email}
              dataNascimento={new Date(user.dataNascimento).toLocaleDateString('pt-PT')}
              naturalidade={`${user.distrito}, ${user.pais}`}
              fotoUrl={user.fotoUrl}
              userId={user.id}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={users?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}