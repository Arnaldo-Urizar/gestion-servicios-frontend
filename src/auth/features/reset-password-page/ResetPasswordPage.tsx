import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { RecoverPassDto } from "../../../core/models/dto/RecoverPassDto";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!token) {
            setError("Token inválido o faltante.");
            return;
        }
        if(newPassword !== confirmPassword){
            setError("Las contraseñas no coinciden.")
            return
        }
        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        setLoading(true);
        const credentials: RecoverPassDto = { token, newPassword };
        try {
            await AuthService.changePassword(credentials);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'No se puedo restablecer la contraseña, Intenténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <div className="card-body">
                            <h1 className="text-center">Restablecer Contraseña</h1>
                            {success ? (
                                <div className="alert alert-success">
                                    Contraseña restablecida exitosamente. Redirigiendo al inicio de
                                    sesión...
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="mb-3">
                                        <label className="form-label">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Ingresa tu nueva contraseña"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Repite tu nueva contraseña"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Procesando..." : "Restablecer Contraseña"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
