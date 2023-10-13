import React, {useState} from 'react'
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Alerta from '../elementos/Alerta';


const SignUp = () => {

    

    const [usuario, setUsuario] = useState('')
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false)
    const [alerta, cambiarAlerta] = useState({})

    const handleChange = (e) =>{
        switch(e.target.name){
            case 'usuario':
                setUsuario(e.target.value)
                break;
            case 'correo':
                setCorreo(e.target.value)
                break;
            case 'password':
                setPassword(e.target.value)
                break;
            case 'password2':
                setPassword2(e.target.value)
                break;
            default:
                break;
        }
    }

    const registration = async () => {
        try {
          const response = await fetch('registration.php', {
            method: 'POST',
            mode: 'cors', // add this line to enable CORS
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, correo, password })
          });
      
          const data = await response.json();
          console.log(data); // Display the response from the PHP file
      
          if (data.message === "Username or email already registered") {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
              tipo: 'error',
              mensaje: 'Username or email already registered'
            });
          } else if (data.message === "You are registered successfully") {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
              tipo: 'exito',
              mensaje: 'The user has been registered successfully'
            });
          } else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
              tipo: 'error',
              mensaje: 'There was a problem with the sign up'
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
      

    
    const handleSubmit= async(e) =>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Verificar si es un correo valido
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if(!expresionRegular.test(correo)){
            cambiarEstadoAlerta(true)
            cambiarAlerta({
                tipo:'error',
                mensaje:'Ingrese un correo electronico valido'
            })
            return;
        }
        //Verificar si no dejo vacio algun campo 

        if(usuario === '' || correo === '' || password === '' || password2 === ''){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Por favor rellena todos los datos'
			});
			return;
        }
        //Verificar si las contraseñas son iguales
        if(password !== password2){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Las contraseñas no son iguales'
			});
			return;
		}

        if(password.length > 15 || password2.length > 15 ){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Las contraseñas son de maximo 14 caracteres'
			});
			return;
		}

        if(password.length < 6 || password2.length < 6 ){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Las contraseñas son de minimmo 6 caracteres'
			});
			return;
		}

        await registration(); 

        if(alerta.tipo == "exito"){
            setUsuario('');
            setCorreo('');
            setPassword ('');
            setPassword2('');
        }
        
    }


    return ( 
        <>
            <Contenedor>
                <h1>Sign Up</h1>
                <Formulario  method="post"  onSubmit={handleSubmit}>
                    <Input >
                        <input 
                            type="text" 
                            name="usuario"
                            placeholder="Username:" 
                            value={usuario}
                            onChange={handleChange}
                        />
                    </Input>
                    <Input >
                        <input 
                            type="email"  
                            name="correo" 
                            placeholder="Email:"
                            value={correo}
                            onChange={handleChange}
                        />
                    </Input>
                    <Input>
                        <input 
                            type="password"  
                            name="password" 
                            placeholder="Password:"
                            value={password}
                            onChange={handleChange}
                        />
                    </Input>
                    <Input >
                        <input 
                            type="password" 
                            name="password2" 
                            placeholder="Repeat password:"
                            value={password2}
                            onChange={handleChange}
                        />
                    </Input>
                    <div >
                        <input type="submit" value="Sign Up" name="submit"/>
                    </div>
                </Formulario>
            
                <div><p>Already registered? <Link to='/Login' >Sign in here</Link></p></div>
            </Contenedor>
            <Alerta 
                    tipo={alerta.tipo}
                    mensaje={alerta.mensaje}
                    estadoAlerta={estadoAlerta}
                    cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </>
     )
     }
 
export default SignUp;

const Contenedor = styled.div`
   
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;

    p {
        margin-top: 10px;
    }
  
    a {
        text-decoration: none;
        color: #0b0ba5;
    }
    
    a:hover {
        text-decoration: underline;
  }

  h1{
    margin-bottom: 35px;
  }
`;



const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    input[type="text"],
    input[type="email"],
    input[type="password"] {
        width: 300px;
        height: 40px;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    input[type="submit"] {
        width: 150px;
        height: 40px;
        margin-top: 10px;
        background-color: #e5ca50;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 15px;
    }

    input[type="submit"]:hover{
        background-color: #ffcc00;
    }
`;

const Input = styled.div`
    margin-bottom:30px;
`;


  