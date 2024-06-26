import React, { useEffect } from 'react';
import './LoginForm.css'; // Assuming this file contains additional styles
import Logo from '../../assets/E-Emplois. (2)_prev_ui.svg'; // Path to your logo
import Login from './Login'; // Assuming Login component is imported

function LoginForm() {
    useEffect(() => {
        // useEffect hook to trigger animation on component mount
        const title = document.querySelector('.typewriter-text');
        if (title) {
            title.style.animationPlayState = 'running';
        }
    }, []);

    return (
        <div style={{ background: "#f8f9fa" }} className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <div style={{ borderRadius: "15px", width: "800px", height: "470px", boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)" }} className="row border p-3 bg-white box-area">
                {/* Left box */}
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" id='img-container'>
                    <div className="featured-image animate-logo">
                        <img src={Logo} className="img-fluid" style={{ margin: 0, width: '250px' }} alt="Illustration" />
                    </div>
                    <p className="text-white fs-3 typewriter-text" style={{marginBottom:"10px", marginTop:"-40px", fontFamily: 'Courier New, Courier, monospace', fontWeight: 600 }}>Rejoignez-nous</p>
                    <small className="text-white text-wrap text-center" style={{ width: '17rem', fontFamily: 'Courier New, Courier, monospace' }}>Joignez-vous à la meilleure plateforme de gestion et de consultation d'emploi du temps en ligne.</small>
                </div>

                {/* Right box */}
                <div style={{ padding: "0 20px" }} className="col-md-6 right-box">
                    <Login />
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
