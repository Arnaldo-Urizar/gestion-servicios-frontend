import React, { useEffect, useState } from "react";
import { FaFacebookSquare, FaInstagramSquare, FaWhatsappSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getData } from "../../../core/services/apiService";
import { FooterInfoDto } from "../../../core/models/dto/FooterInfoDto";
import { getCookie, setCookie } from "../../../core/utils/cookiesUtils";

const Footer: React.FC = () => {

    //Estado para manejar la información principal
    const [data, setData] = useState<FooterInfoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //Hook para obtener los datos de la API de información principal
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Verificar si la información está en una cookie
                const cookieData = getCookie("footerInfo");
                if (cookieData) {
                    // Si existe, usar la información de la cookie
                    setData(JSON.parse(cookieData));
                } else {
                    const response = await getData<FooterInfoDto>("/info/footer");
                    setData(response);
                    // Almacenar la información en una cookie (válida por 7 días)
                    setCookie("footerInfo", JSON.stringify(response), 7);
                }
            } catch (error) {
                console.error(error);
                setError("Error al cargar la información principal");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //Renderizado condicional para manejar los estados de carga y error
    if (loading) {
        return <div className="text-center py-5">Cargando..</div>
    }
    if (error) {
        return <div className="text-center py-5">{error}</div>
    }

    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted pt-2 mt-auto">
            <section className="">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        {/* Slogan */}
                        <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-gem me-3">{data?.name}</i>
                            </h6>
                            <p>{data?.slogan}</p>
                        </div>
                        {/* Dirección */}
                        <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Dirección</h6>
                            <p>Calle {data?.street}</p>
                            <p>{data?.district}, {data?.location}, {data?.province}</p>
                            <Link to="https://www.google.com/maps/place/CLUB+SANTA+MARIA/@-33.207028,-68.4245363,321m/data=!3m1!1e3!4m6!3m5!1s0x967e59fc88ce3c3f:0xb1ff918bf093f8fe!8m2!3d-33.207201!4d-68.423545!16s%2Fg%2F11jsw09_j1?entry=ttu" target="_blank" className="text-decoration-none" >Ver Ubicacion</Link>
                        </div>
                        {/* Compañía */}
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Compañía</h6>
                            <p><Link to="#"  className="text-decoration-none">Acerca de</Link></p>
                            <p><Link to="/faq"  className="text-decoration-none">Preguntas frecuentes</Link></p>
                            <p><Link to="#"  className="text-decoration-none">Servicios</Link></p>
                        </div>
                        {/* Contactos */}
                        <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
                            <p>
                                <Link to={data?.facebookUrl || "#"} target="_blank"  className="text-decoration-none">
                                    <FaFacebookSquare className="me-1" /> Facebook
                                </Link>
                            </p>
                            <p>
                                <Link to={data?.whatsappUrl || "#"} target="_blank" className="text-decoration-none">
                                    <FaWhatsappSquare className="me-1" /> Whatsapp
                                </Link>
                            </p>
                            <p>
                                <Link to={data?.instagramUrl || "#"} target="_blank"  className="text-decoration-none">
                                    <FaInstagramSquare className="me-1" /> Instagram
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="text-center p-4">© 2025 LUCRA. Todos los derechos reservados</div>
        </footer>
    );
};

export default Footer;