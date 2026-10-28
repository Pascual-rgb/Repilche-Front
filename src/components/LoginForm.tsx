import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import '../components/styles/CheckoutModal.css';
import './styles/LoginForm.css'

const LoginForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{
        show: boolean;
        type: 'success' | 'error';
        title: String;
        message: String;
    } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!formRef.current) return;

        setIsLoading(true);
        setFeedback(null);

        const data = new FormData(formRef.current)
        const usuario = Object.fromEntries(data)

        try {
            await login(usuario);

            setIsLoading(false);
            setFeedback({
                show: true,
                type: 'success',
                title: '¡Bienvenido de nuevo!',
                message: 'Iniciaste sesión correctamente. Redirigiendo...'
            });
            
            setTimeout(() => {
                navigate("/");
                formRef.current?.reset();
            }, 2000);

        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setIsLoading(false);
            const esErrorDeConexion = error?.message?.includes("Failed to fetch") || error?.name === "TypeError";
            setFeedback({
                show: true,
                type: 'error',
                title: 'Aviso de acceso',
                message: esErrorDeConexion
                ? "Por favor, verificá tus datos. El correo o la contraseña son incorrectos."
                : (error.message || "Por favor, verificá los datos ingresados.")
            });
        }
    }

    return(
        <>
        <div className='Login-header'>
            <h1 className=''>Inicio de Sesión</h1>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className='login-form'>
            <div>
                <label htmlFor="email" className="form-label mt-4">Email</label>
                <input 
                    type="email" 
                    name="email" /* <--- ¡Importante: Agregado name! */
                    className="form-control" 
                    id="email" 
                    aria-describedby="emailHelp" 
                    placeholder="tu@email.com" 
                    required 
                />
            </div>
            <div>
                <label htmlFor="password" className="form-label mt-4">Contraseña</label>
                <input 
                    type="password" 
                    name="password" /* <--- ¡Importante: Agregado name! */
                    className="form-control" 
                    id="password" 
                    placeholder="password" 
                    autoComplete="off" 
                    required 
                />
            </div>
            <button type='submit' disabled={isLoading}>
                {isLoading ? <div className="checkout-pinner"></div> : 'Enviar'}
            </button>
            <Link to="/registro" className="login-link">
                No tengo cuenta
            </Link>
        </form>

        {(isLoading || (feedback && feedback.show)) && (
            <div className="checkout-modal-overlay">
                <div className="checkout-modal-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            
                {isLoading && (
                    <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div className="checkout-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
                        <h3 style={{ fontFamily: 'Viga', fontSize: '22px', margin: 0 }}>Iniciando sesión...</h3>
                        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Estamos verificando tus credenciales.</p>
                    </div>
                )}

                {!isLoading && feedback && feedback.show && (
                    <>
                        <div className="checkout-exito-icon" style={{
                        background: feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
                        color: feedback.type === 'success' ? '#2e7d32' : '#c62828'
                    }}>
                        {feedback.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
                    </div>

                    <div className="checkout-modal-header">
                        <h2>{feedback.title}</h2>
                        <p>{feedback.message}</p>
                    </div>

                        <button type="button" className="checkout-btn-compras" onClick={() => setFeedback(null)}>
                            Entendido
                        </button>
                    </>
                    )}

                 </div>
                </div>
            )}
        </>
    )
}

export default LoginForm