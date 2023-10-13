import React, {useState, useEffect} from 'react';
import userPhoto from './../imagenes/userNotSet.jpeg'
import {useLogin} from './../Contexts/LoginAuth'
import { FaFacebookF,FaTwitter,FaInstagram, FaGithubAlt, FaGlobe,FaPlus, FaTimes , FaTrash} from "react-icons/fa"
import { MdAddAPhoto } from "react-icons/md";
import listaLupa from './../imagenes/lupa.png'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {useNavigate,  Link} from 'react-router-dom';
import Resizer from 'react-image-file-resizer';

const Perfil = () => {
    const {user, setUser} = useLogin();

    const [values, setValues] = useState([]);
    
    const navigate = useNavigate ();
    const [state, setState] = useState(true)
    const [datos, setDatos] = useState({
        usuario: '',
        website: '',
        github: '',
        twitter: '',
        instagram: '',
        facebook: '',
        image: userPhoto
      });
      
    
    const getFavourites = async (userId) => {
        
            try {
              const response = await fetch(`../database/favoritos.php?userId=${userId}`);
              if (response.ok) {
                const data = await response.json();
                return data.favorites;
              } else {
                console.error('Error fetchingggggg favorites');
                return [];
              }
            } catch (error) {
              console.error('Error fetching favorites', error);
              return [];
            }
          };
    

    const getUserInfo = async (userId) => {
        
        try {
          const response = await fetch(`../database/editUser.php?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            return data.userInfo;
          } else {
            console.error('Error fetchingggggg user info');
            return [];
          }
        } catch (error) {
          console.error('Error fetching user info', error);
          return [];
        }
      };


///// Save image to db
      const saveImageToDatabase = async (imageData, usuario) => {
        // Make an API call to save the image data to the database
        try {
          const response = await fetch('../database/saveImage.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData , userId: usuario}),
          });
    
          if (response.ok) {
            console.log('Image saved to database successfully');
            // const updatedUserData = await getSavedImage(user.ID);
            // const usuario = updatedUserData.find((user) => user.ID === user.ID);
            // if (usuario && usuario.image) {
            //   setProfilePicture(usuario.image);
            // }
          } else {
            console.error('Error saving image to database');
          }
        } catch (error) {
          console.error('Error saving image to database', error);
        }
      };

//// upload image and save to db

      const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        
        try {
          const resizedImage = await resizeImage(file);
          setDatos((prevDatos) => ({
            ...prevDatos,
            image: resizedImage
          }));
          await saveImageToDatabase(resizedImage , user.ID);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
    
      const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
          Resizer.imageFileResizer(
            file,
            100, // maximum width
            100, // maximum height
            'JPEG', // output format
            70, // quality
            0, // rotation
            (uri) => {
              resolve(uri);
            },
            'base64' // output type
          );
        });
      };
     
//Handle input value change

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.slice(0, 25); // Trim the value to a maximum of 50 characters
        setDatos({ ...datos, [name]: trimmedValue });
      };


      // Open popup form
    const handleEdit = (e) => {
        e.preventDefault()
        setState(!state)      
    };  


    const handleSave = async (e) => {
        e.preventDefault()

        const userData = {
            usuario:datos.usuario,
            website:datos.website,
            github:datos.github,
            twitter:datos.twitter,
            instagram:datos.instagram,
            facebook:datos.facebook,
            ID: user.ID,
            image: userPhoto
        };

        

        try {
            const response = await fetch('../database/editUser.php', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
            });
        
            if (response.ok) {
        
                const updatedUserData = await getUserInfo(user.ID);
                updatedUserData.map( (usuario) =>{
                    if(usuario.ID == user.ID){
                        setDatos(usuario)
                        setValues(usuario);
                        setUser(usuario);
                        localStorage.setItem('user', JSON.stringify(usuario));
                    }
                })
            } else {
            console.error('Error updating user');
            }
        } catch (error) {
            console.error('Error updatiiing user', error);
        }

        setState(!state)
    };
    
      const handleClose = ()=>{
          console.log(state)
          setDatos(values)
          setState(!state)
      }

   
    
    const [favs, setFavs] = useState([]);
    const [movieID, setMovieID] = useState([]);


    ///////// USE EFFECT /////////////////
    
    useEffect(() => {
        const getFavorite = async () => {
            const updatedFavorites = await getFavourites(user.ID);
            
            if (updatedFavorites.length > 0) {
                setMovieID(updatedFavorites);
    
                const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
                const favsData = await Promise.all(updatedFavorites.map(async (ID) => {
                    let media = '';

                    if (ID.media_type == 'Movies') {
                      media = 'movie';
                    } else {
                      media = 'tv';
                    }
                    const response = await fetch(`https://api.themoviedb.org/3/${media}/${ID.movie_id}?api_key=${apiKey}`);
                    const data = await response.json();
                    return { ...data, favorite_id: ID.favorite_id , media };
                }));
                setFavs(favsData);
            }
        };

        const getUserData = async () => {
            const updatedUserData = await getUserInfo(user.ID);
            updatedUserData.map( (usuario) =>{
                if(usuario.ID == user.ID){
                    setDatos(usuario);
                    setValues(usuario);
                }
            })
            
        };
    
        getUserData();
        getFavorite();
        
        

    }, [user.ID, setFavs]);
    
  
    const deleteFavorite = async (e, favoriteId) => {
        e.preventDefault();
    
        const confirmDelete = window.confirm('Are you sure you want to delete this favorite?');
    
        if (confirmDelete) {
        const favoriteID = {
            user_id: user.ID,
            favorite_id: favoriteId
        };
    
        try {
            const response = await fetch('../database/borrarFavorito.php', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteID)
            });
    
            if (response.ok) {
            console.log('Favorite deleted successfully');
            // Update the movieID state by filtering out the deleted favorite
            setFavs((prevFavorites) =>
                prevFavorites.filter((favorite) => favorite.favorite_id !== favoriteId)
                );
            } else {
            console.error('Error deleting favorite');
            }
        } catch (error) {
            console.error('Error deleting favorite', error);
        }
        }
    };


    return ( 
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Perfil</title>
                </Helmet>
                <div className="container-perfil">
                    <div 
                        id="popup-form"
                        className={state ? 'active' : null}    
                    >
                        <img src={datos.image} alt="" />
                        <FaTimes
                            className='btn-close-perfil'
                            onClick={handleClose}

                        />
                        <MdAddAPhoto
                            className='btn-edit-perfil custom-color'
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = handleImageUpload;
                                input.click();
                            }}
                            />

                        <form action="" className="edit-form">
                                    
                                    <input 
                                        id='user-data-input'
                                        type="text"
                                        value={datos.usuario}
                                        placeholder="Introduce tu Nombre"
                                        name='usuario'
                                        onChange={handleInputChange}
                                    />
                                    <input 
                                        id="media-input" 
                                        type="text"
                                        value={datos.website}
                                        name='website'
                                        placeholder="www.website.com"
                                        onChange={handleInputChange}
                                    />
                                    <input 
                                        id="media-input" 
                                        type="text"
                                        value={datos.github}
                                        name='github'
                                        placeholder="@github"
                                        onChange={handleInputChange}
                                    />
                                    <input 
                                        id="media-input" 
                                        type="text"
                                        value={datos.twitter}
                                        name='twitter'
                                        placeholder="@twitter"
                                        onChange={handleInputChange}
                                    />
                                    <input 
                                        id="media-input" 
                                        type="text"
                                        value={datos.instagram}
                                        placeholder="@instagram"
                                        name='instagram'
                                        onChange={handleInputChange}
                                    />
                                    <input 
                                        id="media-input" 
                                        type="text"
                                        value={datos.facebook}
                                        name='facebook'
                                        placeholder="@facebook"
                                        onChange={handleInputChange}
                                    />
                            <button
                                onClick={handleSave}
                                className="cool-button"
                            >Guardar</button>
                        </form>
                    </div>
                    <div className="container-boxes">
                        <div className="user-info">
                            <div className="user-photo">
                                <img src={values.image} alt="" />
                            </div>
                            <div className="user-form">
                                <form className="user-data">
                                <span>{values.usuario}</span> 
                                    <button 
                                        className='cool-button'
                                        onClick={handleEdit}
                                    >Editar</button>
                                </form>
                            </div>
                        </div>
                        <div className="user-media">
                            <div className="user-media-container">
                                <span className="media-info web"><FaGlobe/>Website</span>
                                <span className='media-information'>{values.website}</span> 
                            </div>
                            <div className="user-media-container">
                                <span className="media-info git"><FaGithubAlt/>Github</span>
                                <span className='media-information'>{values.github}</span> 
                            </div>
                            <div className="user-media-container">
                                <span className="media-info twitter"><FaTwitter/>Twitter</span>
                                <span className='media-information'>{values.twitter}</span> 
                            </div>
                            <div className="user-media-container">
                                <span className="media-info instagram"><FaInstagram/>Instagram</span>
                                <span className='media-information'>{values.instagram}</span> 
                            </div>
                            <div className="user-media-container">
                                <span className="media-info face"><FaFacebookF/>Facebook</span>
                                <span className='media-information'>{values.facebook}</span> 
                            </div>
                            
                        </div>
                        <div className="user-profile-page">
                            <div className="profile-favs">
                                <span className="favs-section-title">
                                    <h2>Favoritos</h2>
                                </span>
                                 <>
                                    {favs.length > 0 ? (
                                        favs.map((fav) => {
                                        // Find the corresponding favorite object in movieID state
                                        const favorite = movieID.find((favorite) => favorite.movie_id === fav.id);

                                        return (
                                            
                                            <div key={fav.id} className="lista-favoritos">
                                                <div className="titulo-favs" onClick={()=> navigate(`/${fav.media}/${fav.id}`)}>
                                                    {fav.name ?
                                                    <Link to={`/${fav.media}/${fav.id}`}  className="link-fav">
                                                        {fav.name}
                                                    </Link>
                                                    :
                                                    <Link to={`/${fav.media}/${fav.id}`}  className="link-fav">
                                                        {fav.title}
                                                    </Link>    
                                                    }
                                                    <FaTrash onClick={(e) => deleteFavorite(e, favorite.favorite_id)} />
                                                </div>
                                            </div >
                                        );
                                        })
                                    ) : (
                                        <div className="lista-vacia">
                                        <img src={listaLupa} alt="" />
                                        <h2>Lista Vacia</h2>
                                        <span>Aun no tienes nada agregado</span>
                                        </div>
                                    )}
                                </>

                                
                            </div>
                        </div>
                    </div>
                </div>
            </HelmetProvider>
        </>
     );
}
 
 
export default Perfil;