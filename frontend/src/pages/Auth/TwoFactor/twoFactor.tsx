import React from 'react'
import styles from "./twoFactor.module.css" // Importar estilos de Login modules
import { useNavigate } from "react-router-dom";

const TwoFactor: React.FC = () => {
    const navigate = useNavigate()
    return (

        <div className={styles.twoFactor}>
            <div className={styles.container}>
            <button type='submit' className={styles.btn} onClick={() => navigate("/dashboard_doctor")}>DASHBOARD DOCTOR</button>
            <button type='submit' className={styles.btn} onClick={() => navigate("/dashboard_admin")}>DASHBOARD ADMIN</button>
            <button type='submit' className={styles.btn} onClick={() => navigate("/dashboard_patient")}>DASHBOARD PACIENTE</button>
            </div>
        </div>
    )
}

export default TwoFactor