import React, {useState} from 'react'
import styled from 'styled-components';
import { Link , useNavigate} from 'react-router-dom';
import {useLogin} from './../Contexts/LoginAuth'
import Alerta from '../elementos/Alerta';

const Login = () => {

    const {setUser} = useLogin()
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false)
    const [alerta, cambiarAlerta] = useState({})
    const navigate = useNavigate ();




    const handleChange = (e) =>{
        switch(e.target.name){
            case 'correo':
                setCorreo(e.target.value)
                break;
            case 'password':
                setPassword(e.target.value)
                break;
            default:
                break;
        }
    }

    const login = async () => {
        try {
          const response = await fetch('../database/login.php', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `correo=${correo}&password=${password}`
          });
      
          const data = await response.json();
      
          if (data.error) {
            console.log(data.error); // Display the error message in the console
            cambiarEstadoAlerta(true)
            cambiarAlerta({
                tipo:'error',
                mensaje:'Invalid email or password'
            })
          } else {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            cambiarEstadoAlerta(true)
                cambiarAlerta({
                    tipo:'exito',
                    mensaje:'The user has logged in successfully'
                })
          }
        } catch (error) {
          console.error(error);
        }
      };
      
      
      
      
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
		cambiarAlerta({});

		// Comprobamos del lado del cliente que el correo sea valido.
		const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
		if( !expresionRegular.test(correo) ){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Por ingresa un correo electrónico valido'
			});
			return;
		}

		if(correo === '' || password === ''){
			cambiarEstadoAlerta(true);
			cambiarAlerta({
				tipo: 'error',
				mensaje: 'Por favor rellena todos los datos'
			});
			return;
		}
        await login();
        let tiempo;

		if(alerta.tipo == "exito"){
			tiempo = setTimeout(() => {
				cambiarEstadoAlerta(false);
                navigate('/')
			}, 2000);
		}

		return(() => clearTimeout(tiempo));
       
};


    return ( 
        <>
            <Contenedor>
                <h1>Sign In</h1>
                <Formulario   method="post"  onSubmit={handleSubmit}>
                
                    <Input >
                        <input 
                                type="email"  
                                name="correo" 
                                placeholder="Correo:"
                                value={correo}
                                onChange={handleChange}
                        />
                    </Input>
                    <Input >
                        <input 
                                type="password"  
                                name="password" 
                                placeholder="Password:"
                                value={password}
                                onChange={handleChange}
                        />
                    </Input>
                    <Input >
                        <input type="submit" value="Login" name="login" />
                    </Input>
                </Formulario>
            <div><p>Not registered yet? <Link to='/SignUp' >Register Here</Link></p></div>
            </Contenedor>
            <Alerta 
                    tipo={alerta.tipo}
                    mensaje={alerta.mensaje}
                    estadoAlerta={estadoAlerta}
                    cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </>
     );
}
 
export default Login;

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


  