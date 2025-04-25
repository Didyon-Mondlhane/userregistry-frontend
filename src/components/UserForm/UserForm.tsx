import { useState, useRef, useEffect } from 'react';
import { User } from '../../types/User';
import { useUserMutate } from '../../hooks/useUserMutate';
import './UserForm.css';

interface UserFormProps {
  initialData?: User;
  isEditMode?: boolean;
}

export function UserForm({ initialData, isEditMode = false }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    nome: '',
    apelido: '',
    dataNascimento: new Date(),
    pais: '',
    provincia: '',
    distrito: '',
    email: '',
    fotoUrl: '',
    ...initialData
  });

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { mutate, isPending } = useUserMutate();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "foto.png", { type: "image/png" });
          const fotoUrl = await uploadPhoto(file);
          setFormData(prev => ({ ...prev, fotoUrl }));
          setShowPhotoModal(false);
        }
      }, 'image/png');
    }
    stopCamera();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fotoUrl = await uploadPhoto(e.target.files[0]);
      setFormData(prev => ({ ...prev, fotoUrl }));
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    // Implementação real do upload para o servidor
    const formData = new FormData();
    formData.append('foto', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.fotoUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

return (
  <div className="form-wrapper">
    <div className="form-header">
      <h1>{isEditMode ? 'Editar' : 'Registo de'} Utilizador</h1>
      <p>Preencha os dados {isEditMode ? 'para actualizar' : 'para criar'} sua conta</p>
    </div>

    <form onSubmit={handleSubmit}>
      {/* Nome e Apelido */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome" className="required">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apelido" className="required">Apelido</label>
          <input
            type="text"
            id="apelido"
            name="apelido"
            value={formData.apelido}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </div>

      {/* Data de Nascimento */}
      <div className="form-group">
        <label htmlFor="dataNascimento" className="required">Data de Nascimento</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento.toISOString().split('T')[0]}
          onChange={(e) => 
            setFormData(prev => ({ ...prev, dataNascimento: new Date(e.target.value) }))
          }
          className="form-control"
          required
        />
      </div>

      {/* Naturalidade */}
      <fieldset className="naturalidade-fieldset">
        <legend className="naturalidade-legend">Naturalidade</legend>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pais" className="required">País</label>
            <input
              type="text"
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="provincia" className="required">Província</label>
            <input
              type="text"
              id="provincia"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="distrito" className="required">Distrito</label>
          <input
            type="text"
            id="distrito"
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </fieldset>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="required">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Foto */}
      <div className="form-group">
        <label className="required">Foto</label>
        <div 
          className="photo-container" 
          onClick={() => setShowPhotoModal(true)}
        >
          <p>
            {formData.fotoFile 
              ? formData.fotoFile.name 
              : formData.fotoUrl 
                ? "Foto carregada" 
                : "Selecione uma foto"}
          </p>
          <input 
            type="file" 
            id="foto"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      <button type="submit" className="btn-register" disabled={isPending}>
        {isPending ? 'Processando...' : isEditMode ? 'Atualizar' : 'Registar'}
      </button>
    </form>

    {/* Modal da Câmera */}
    {showPhotoModal && (
      <div className="photo-options">
        <div className="photo-options-content">
          {stream ? (
            <div className="camera-view">
              <video ref={videoRef} autoPlay playsInline />
              <button 
                type="button" 
                className="photo-option-btn"
                onClick={capturePhoto}
              >
                Capturar Foto
              </button>
              <button 
                type="button" 
                className="photo-option-btn cancel"
                onClick={() => {
                  stopCamera();
                  setShowPhotoModal(false);
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="photo-choice">
              <button 
                type="button" 
                className="photo-option-btn"
                onClick={startCamera}
              >
                Tirar Foto
              </button>
              <button 
                type="button" 
                className="photo-option-btn"
                onClick={() => document.getElementById('foto')?.click()}
              >
                Escolher da Galeria
              </button>
              <button 
                type="button" 
                className="photo-option-btn cancel"
                onClick={() => setShowPhotoModal(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}