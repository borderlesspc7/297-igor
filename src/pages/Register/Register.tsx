import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterCredentials } from "../../types/user";
import "./Register.css";
import logo from "../../assets/logo.jpg";

export default function Register() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: "",
    password: "",
    name: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validações
    if (credentials.password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (credentials.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (credentials.name.trim().length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await register(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">
              <img src={logo} alt="Logo EcoCorp" />
            </div>
          </div>
          <h1>Criar conta</h1>
          <p>Comece a gerenciar o aquecimento dos seus números</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="register-error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="register-form-group">
            <label htmlFor="name">Nome completo</label>
            <div className="register-input-wrapper">
              <User className="register-input-icon" size={20} />
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={credentials.name}
                onChange={(e) =>
                  setCredentials({ ...credentials, name: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={3}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="email">E-mail</label>
            <div className="register-input-wrapper">
              <Mail className="register-input-icon" size={20} />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Senha</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" size={20} />
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" size={20} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="register-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="register-loading-spinner"></span>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Criar conta</span>
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className="link">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
