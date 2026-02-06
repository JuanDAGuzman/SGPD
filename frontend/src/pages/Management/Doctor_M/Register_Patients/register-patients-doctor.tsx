import styles from "./register-patientes-doctor.module.css"
import { useNavigate } from "react-router-dom";
import Navbar_G from "../../../../components/NavBars/Navbar_Globla";
import React, { useState, useEffect } from 'react';


const Registro_Patient: React.FC = () => {
    const navigate = useNavigate()
    const [formValues, setFormValues] = useState ({
        nombre: '',
        apellidos: '',
        tipoDocumento: '',
        numeroDocumento: '',
        sexo: '',
        diagnostico: '',
        accesoVascular: '',
        fechaNacimiento: '',
        ciudad: '',
        centroSalud: '',
        correoelectronico: ""
    })

    const [isFormValid, setIsFormValid] = useState(false)
    const [docLenghtValid, setDocLenghtValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLScriptElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement
        const {id, value, name } = target
        setFormValues(prev => ({
            ...prev,
            [id || name]: value
        }))
    }

    useEffect(() => {
        //Validación de documento valido
        const isDocValid = formValues.numeroDocumento.length > 7
        setDocLenghtValid(isDocValid)

        //Validar que todos los campos esten llenos y el documento sea valido
        const allFilled = Object.values(formValues).every(val => val !== '')
        setIsFormValid(allFilled && isDocValid)
    }, [formValues])

    const [docTouched, setDocTouched] = useState(false);


    return (
        <div className={styles.Registro_Patient}>

            <Navbar_G 
                profileText='Nombre'
                profilePath='/'
                profileImg='public/user.png'
                centerText='Registra tu Paciente'
                menuItems={[]}
                onLogout={() => navigate('/Support_D')}
                logoutText='Soporte'
            />
        
            {/* Imagen medicos */}
            <img src="../../../../public/logo_medicos2.png" alt="Logo medicos" className={styles.logo} />

            {/* CONTENDOR PAGINA */}
            <div className={styles.container}>
                <h1 className={styles.title}>Registro de pacientes</h1>

                {/* CONTENDOR REGISTRO */}
                <div className={styles.Content}>
                    <div className={styles.formContainer}>
                        <div className={styles.column}>

                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" placeholder="Escribe el o los nombres" className={styles.info} value={formValues.nombre} onChange={handleChange}/>

                            
                            <label htmlFor="Documento">Documento de Identidad</label>
                            <div className={styles.docRow}>
                                <select id="Tipo de Documento" className={styles.Select} aria-label="Tipo de Documento" defaultValue="" value={formValues.tipoDocumento} onChange={(e) =>{
                                    setFormValues(prev => ({...prev, tipoDocumento: e.target.value}))
                                }}>
                                    <option value="" disabled hidden>TIPO</option>
                                    <option value="CC">CC</option>
                                    <option value="TI">TI</option>
                                    <option value="CE">CE</option>
                                    <option value="RC">RC</option>
                                </select>
                                 {/* WRAPPER ADICIONAL PARA EL TOOLTIP */}
                                <div className={styles.tooltipWrapper}>
                                    <input
                                        type="text"
                                        id="numeroDocumento"
                                        placeholder="Número de Documento"
                                        className={styles.info}
                                        value={formValues.numeroDocumento}
                                        onChange={handleChange}
                                        onBlur={() => setDocTouched(true)}
                                    />

                                    {/* BURBUJA DE ERROR */}
                                    {!docLenghtValid && docTouched && formValues.numeroDocumento && (
                                        <div className={styles.tooltip}>
                                            El número de documento está incompleto
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <label htmlFor="sexo">Sexo</label>
                                <div className={styles.sexo}>
                                    <label><input type="radio" name="sexo" value="Masculino" checked={formValues.sexo === 'Masculino'} onChange={handleChange}/> Masculino </label>
                                    <label><input type="radio" name="sexo" value="Femenino" checked={formValues.sexo === 'Femenino'} onChange={handleChange}/> Femenino </label>
                                </div>

                            <label htmlFor="diagnostico">Diagnóstico</label>
                            <select id="diagnostico" className={styles.SelectLine} aria-label="Diagnostico Paciente" defaultValue="" value={formValues.diagnostico} onChange={(e) =>{
                                    setFormValues(prev => ({...prev, diagnostico: e.target.value}))
                                }}>
                                <option value="" disabled hidden> Elija el Diagnostico</option>
                                <option value="No complicado">Pie diabético no complicado</option>
                                <option value="Infección">Pie diabético con infección</option>
                                <option value="Isquemia">Pie diabético con isquemia</option>
                                <option value="Úlcera">Úlcera neuropática</option>
                                <option value="Osteoarticular">Infección osteoarticular</option>
                                <option value="Amputación">Amputación previa</option>
                            </select>

                            <label htmlFor="Acceso_vas">Acceso Vascular</label>
                            <select id="Acceso_vas" className={styles.SelectLine} aria-label="Acceso Vascular" defaultValue="" value={formValues.accesoVascular} onChange={(e) =>{
                                    setFormValues(prev => ({...prev, accesoVascular: e.target.value}))
                                }}>
                                <option value="" disabled hidden> Elija el tipo de Acceso</option>
                                <option value="Catéter temporal">Catéter temporal</option>
                                <option value="Catéter tunelizado">Catéter tunelizado</option>
                                <option value="Fístula AV">Fístula arteriovenosa</option>
                                <option value="Injerto">Injerto protésico</option>
                                <option value="Ninguno">Ninguno</option>
                            </select>

                        </div>

                        <div className={styles.column}>

                            <label htmlFor="apellidos">Apellidos</label>
                            <input type="text" id="apellidos" placeholder="Escribe los Apellidos" className={styles.info}  value={formValues.apellidos} onChange={handleChange}/>

                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <input type="date" id="fechaNacimiento" className={styles.info} title="Selecciona la fecha de nacimiento" value={formValues.fechaNacimiento} onChange={handleChange}/>

                            <label htmlFor="ciudad">Ciudad</label>
                            <select id="ciudad" className={styles.SelectLine} aria-label="Ciudad de Residencia" defaultValue="" value={formValues.ciudad} onChange={(e) =>{
                                    setFormValues(prev => ({...prev, ciudad: e.target.value}))
                                }}>
                                <option value="" disabled hidden>Elija la Ciudad</option>
                                <option value="Bogotá">Bogotá</option>
                                <option value="Medellin">Medellin</option>
                                <option value="Barranquilla">Barranquilla</option>
                                <option value="Cali">Cali</option>
                            </select>

                            <label htmlFor="centro_salud">Centro de Salud</label>
                            <select id="centro_salud" className={styles.SelectLine} aria-label="Centro de Salud" defaultValue="" value={formValues.centroSalud} onChange={(e) =>{
                                    setFormValues(prev => ({...prev, centroSalud: e.target.value}))
                                }}>
                                <option value="" disabled hidden>Elija el Centro de Salud</option>
                                <option value="Fundación Santa Fe de Bogotá">Fundación Santa Fe de Bogotá</option>
                                <option value="Hospital Pablo Tobón Uribe">Hospital Pablo Tobón Uribe</option>
                                <option value="Hospital General de Barranquilla">Hospital General de Barranquilla</option>
                                <option value="Fundación Valle del Lili">Fundación Valle del Lili</option>
                            </select>

                            <label htmlFor="Correo_elec">Correo Electronico</label>
                            <input type="text" id="correoelectronico" placeholder="Escribe el correo del paciente" className={styles.info}  value={formValues.correoelectronico} onChange={handleChange}/>
                            
                        </div>     
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.button} disabled={!isFormValid} id="guardarBtn">Guardar</button>
                        <button type="button" onClick={() => navigate('/list_patients_doctor')} className={styles.button}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Registro_Patient