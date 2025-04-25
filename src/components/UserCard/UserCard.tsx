import { Link } from 'react-router-dom';
import './UserCard.css';

interface UserCardProps {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  naturalidade: string;
  fotoUrl?: string;
  userId?: string;
}

export function UserCard({ 
  nomeCompleto, 
  email, 
  dataNascimento, 
  naturalidade, 
  fotoUrl,
  userId
}: UserCardProps) {
  return (
    <div className="user-card">
      <img 
        src={fotoUrl || 'https://randomuser.me/api/portraits/lego/5.jpg'} 
        alt="User" 
        className="user-photo" 
      />
      <div className="user-details">
        <h2>{nomeCompleto}</h2>
        <p><b>Email:</b> {email}</p>
        <p><b>Nascimento:</b> {dataNascimento}</p>
        <p><b>Naturalidade:</b> {naturalidade}</p>
        {userId && (
          <Link to={`/edit/${userId}`} className="edit-link">
            Editar
          </Link>
        )}
      </div>
    </div>
  );
}