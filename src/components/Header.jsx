import React, {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle, faSignOutAlt, faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import {useMovies} from './../Contexts/MoviesContext';
import { Link, useNavigate, NavLink  } from 'react-router-dom';
import logo from './../imagenes/fenix.png'
import {useLogin} from './../Contexts/LoginAuth'

const Header = () => {

    const [inputValue , changeInputValue] = useState('');
    const {setMovies , searchQuery, changeSearchQuery} = useMovies()
    const {user, setUser} = useLogin()

    const navigate = useNavigate ();

    const onChangeInputValue = (e) =>{
        changeInputValue(e.target.value)
    }
 
    const handleSubmit = async (e) =>{
        e.preventDefault();
        changeSearchQuery(inputValue)
    }
////////////////////////////////////////////
    const [state, setState] = useState(true)

    const searchInput = useRef(null)
    const SlideInput = e =>{
        e.preventDefault();
        setState(!state);
        searchInput.current.focus()
    }
   

    const handleBlur = e =>{
        setState(!state)
    
    }
//Log Out Function for php session 

    const handleLogout = async () => {
        try {
          const response = await fetch('../database/logout.php', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
          });
    
          if (response.ok) {
            // Successful logout, you can handle any additional logic here
            console.log('Logout successful');
          } else {
            // Handle logout error
            console.log('Logout error');
          }
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    const SignOut = () =>{
        handleLogout();
        localStorage.removeItem('user');
        setUser(null);
        navigate('/')
    }
//////////////////////////////////////
    useEffect(() => {

        const getMovies = async () =>{
          const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US&query=${searchQuery}&page=1&include_adult=false`);
          const data = await response.json();
          setMovies(data.results);
          navigate(`/Search/query/${searchQuery}`)
        }
        if(searchQuery){
        getMovies()
         }
        
      }, [searchQuery]);
  
    return ( 
       
        <Container>
            <div className="logo-icon-name">
                <Link to="/"><img src={logo} alt="Logo" /></Link>
                <Link to="/"><Logo >FENIX+</Logo></Link>
            </div>
            
           
            <IconosNav className="iconos-nav" >
                <form className={state ? 'active' : null} id="form" onSubmit={handleSubmit}>
                <span className="icon"> <FontAwesomeIcon icon={faSearch} ></FontAwesomeIcon></span>
                    <Search 
                        type="text"  
                        placeholder=" Titulo, Peliculas, Series..."
                        value={inputValue}
                        onChange={onChangeInputValue} 
                        onBlur={handleBlur}
                        ref={searchInput}
                    />
                </form>
                <span 
                    className='icon2'
                    onClick={SlideInput}
                    title="Buscar"
                ><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span>
                
                {user ? 
                <>
                <NavLink className='icon2' to='/Perfil' title="Perfil"><FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon></NavLink>
                <span className='icon2' onClick={SignOut}><FontAwesomeIcon icon={faSignOutAlt} title="Log Out"></FontAwesomeIcon></span>
                </> :
                <NavLink className='icon2' to='/Login'><FontAwesomeIcon icon={faSignInAlt} title="Log In"></FontAwesomeIcon></NavLink>}
                
            </IconosNav>
        </Container>    
     );
}
 

export default Header;

 
export const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background-color: #222831;

    img{
        width:60px;
        margin-left:10px;
    }
    a{
        text-decoration:none;
    }
    a:visited{
        color:white;
    }
`


export const IconosNav = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    color:white;
`


export const MenuNav = styled.ul`
    display: flex;
    list-style: none;
    gap: 20px;
    height:100%;
    align-items:center;
    
    a{
        display:flex;
        color:white;
        text-decoration:none;
        height:100%;
        align-items:center;
        padding:20px;
        text-transform: uppercase;
        
         
    }
    a:hover{
        color: black;
        cursor: pointer;
        background-color:#f8da5b;
        
    }
  
    

    
`

export const Search = styled.input`
    width: 220px;
    outline: none;
    padding-left: 5px;
    height:30px;
    
    `
export const Logo = styled.div`
    color: white;
    font-size: 40px;
    font-family: 'Rubik', sans-serif;
    font-weight:700;
    margin: 10px 15px;
    
    &:hover{
        color: #f8da5b;
        cursor: pointer;
    }
  
`



