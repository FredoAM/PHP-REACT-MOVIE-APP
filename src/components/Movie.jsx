import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {useNavigate  } from 'react-router-dom';
import {useLogin} from './../Contexts/LoginAuth'
import { FaPlus, FaTrash} from 'react-icons/fa'
import userPhoto from './../imagenes/userNotSet.jpeg'

function Movie() {

  const {mediaType, id } = useParams();
  const [soloMovie, setSoloMovie] = useState('');
  const IMG_PATH = 'https://image.tmdb.org/t/p/original/';

  const [textArea, setTextArea] = useState('')
  const [comentarios , setComentarios] = useState([]);
  const {user, setUser} = useLogin()
  const navigate = useNavigate ();
  const [favState, setFavState] = useState(true);
  const [favID, setFavID] = useState([]);
 //// AÑADIR FAVORITOS 

 const AddFav = async (e) => {
  e.preventDefault();

  const infoMoviesUser = {
    movie_id: soloMovie.id,
    user_id: user.ID,
    media_type: mediaType,
  };

  try {
    const response = await fetch('favoritos.php', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(infoMoviesUser),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Log the success message or other response data
      setFavState(false)
    } else {
      const errorData = await response.json();
      console.log(errorData.error); // Log the error message
    }
  } catch (error) {
    if (error.message !== 'Bad Request') {
      console.error('Error saving favorite', error);
    }
  }
};



const getFavourites = async (userId) => {
        
  try {
    const response = await fetch(`favoritos.php?userId=${userId}`);
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



const getUserData = async () => {
  const updatedFavorites = await getFavourites(user.ID);
  
  updatedFavorites.map( (usuario) =>{
    if(usuario.movie_id == id){
        setFavState(false)
        setFavID(usuario.favorite_id)
    }
})};


  useEffect(() => {

    const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
    let media = '';

    if (mediaType == 'Movies') {
      media = 'movie';
    } else {
      media = 'tv';
    }
    const getMovie = async () =>{
      const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}?api_key=${apiKey}`);
      
      const data = await response.json();
      setSoloMovie(data);

      const comments = await fetchMovieComments(id);
        if (comments.length > 0) {
        setComentarios(comments);
        }
    }

    
    getMovie()
      if(user){
        getUserData();
      }

      
    
  }, [id, comentarios, mediaType]);


  const deleteFavorite = async (e, favoriteId) => {
    e.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this favorite?');

    if (confirmDelete) {
    const favoriteID = {
        user_id: user.ID,
        favorite_id: favoriteId
    };

    try {
        const response = await fetch('borrarFavorito.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(favoriteID)
        });

        if (response.ok) {
        console.log(favoriteID);
        } else {
        console.error('Error deleting favorite');
        }
    } catch (error) {
        console.error('Error deleting favorite', error);
    }
    }

    setFavState(true)
};
  ////////
  
  const saveComment = async (e) => {
    e.preventDefault();

    if(textArea == ''){
      return
    }
    const commentData = {
      movie_id: soloMovie.id, 
      user_id: user.ID, 
      comment_text: textArea,
      usuario: user.usuario,
      image: user.image
    };
  
    try {
      const response = await fetch('comentarios.php', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });
  
      if (response.ok) {
        
        const updatedComments = await fetchMovieComments(soloMovie.id);
        setComentarios(updatedComments);
      } else {
        console.error('Error saving comment');
      }
    } catch (error) {
      console.error('Error saving comment', error);
    }
    setTextArea('')
  };
  
  const fetchMovieComments = async (movieId) => {
    try {
      const response = await fetch(`comentarios.php?movieId=${movieId}`);
      if (response.ok) {
        const data = await response.json();
        return data.comments;
      } else {
        console.error('Error fetchingggggg movie comments');
        return [];
      }
    } catch (error) {
      console.error('Error fetching movie comments', error);
      return [];
    }
  };
  


  const deleteComment = async (e, commentId) =>{
    e.preventDefault();

    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
  
    if (confirmDelete) {
    
      const commentID = {
        user_id: user.ID, 
        comment_id: commentId
      };

      try {
        const response = await fetch('borrarComentario.php', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentID)
        });
    
        if (response.ok) {
          
          console.log('Comment deleted successfully')
        } else {
          console.error('Error deleting comment');
        }
        setComentarios((prevComentarios) =>
        prevComentarios.filter((comment) => comment.comment_id !== commentId)
      );
      } catch (error) {
        console.error('Error deleting comment', error);
      }
    }
  }


  return (

    <>
    <HelmetProvider>
              <Helmet>
                {soloMovie.name ? 
                  <title>{soloMovie.name}</title>
                  :
                  <title>{soloMovie.title}</title>
                }
              </Helmet>
                  <MovieCard>
                      <Container theme={theme}> 
                          <Cover src={soloMovie.poster_path ? `${IMG_PATH}${soloMovie.poster_path}` : ''} alt="cover" className='cover-poster'/>
                          
                          <Hero Imagen={soloMovie.backdrop_path ? `${IMG_PATH}${soloMovie.backdrop_path}` : ''}>
                            <Details className='detalles-titulo'>
                              {soloMovie.name ? 
                              <Title1 className="title-movies">{soloMovie.name}<span>PG-13</span></Title1>
                              :
                              <Title1 className="title-movies">{soloMovie.title}<span>PG-13</span></Title1>
                              }
                            </Details>
                          </Hero>
                          
                          <Summary className='summary-container'>
                              <Column1 className='tag-genres' >

                                  {soloMovie ?
                                    soloMovie.genres.map((genero) => (
                                    <Tag key={genero.id} className='tag-generos'>{genero.name}</Tag>
                                  ))
                                      :
                                      <></>
                                  }

                                  {favState && user && (
                                      <span className="add-favs" onClick={AddFav}>
                                        <FaPlus /> Add Favorite
                                      </span>
                                    )}

                                    {favState && !user && (
                                      <p></p>
                                    )}

                                    {!favState && user && (
                                      <span className="add-favs" onClick={(e) => deleteFavorite(e, favID)}>
                                        <FaTrash /> Delete Favorite 
                                      </span>
                                    )}

                                    {!favState && !user && (
                                      <p></p>
                                    )}
                              </Column1> 
                              <Column2 className='overview-column'>
                                  {soloMovie.overview}
                              </Column2> 
                          </Summary> 
                      </Container> 
                  </MovieCard> 
                  <div className="video-container">
                      <div className="video-title">
                          {soloMovie.name? 
                          <h1 >{soloMovie.name}</h1>
                          :
                          <h1 >{soloMovie.title}</h1>  
                          }
                      </div>
                      <video className="video-movies" width="640" height="360" controls>
                      <source src='/videos/MF.mp4' type="video/mp4"/>
                      </video>
                  </div>
                  <div className="cm-container">
                      <div className="video-title">
                          <h1 >Comentarios: </h1>
                      </div>
                        <div className="comment-section">
                            {comentarios.length > 0 ? (
                                comentarios.map((comment) => (
                                <div key={comment.comment_id} className="comment-post">
                                  <div className="user-imagen-post">
                                    <img src={comment.image} alt="" />
                                  </div>
                                  {user && user.ID == comment.user_id ?
                                    <div className="comment-user">
                                      {comment.usuario}
                                      <FaTrash
                                        onClick={(e) => deleteComment(e, comment.comment_id)}
                                      />
                                    </div>
                                    :
                                    <div className="comment-user">
                                      {comment.usuario}
                                    </div>
                                  }
                                    {comment.comment_text}
                                </div>
                                ))
                            ) : (
                                <div className="comment-post">No hay comentarios...</div>
                            )}
                        </div>
                      <div className="add-comment">
                          <form className="form-add-comment">
                          <label htmlFor="comment-input">Agregar Comentario</label>
                          <textarea 
                              name="comment-input" 
                              value={textArea}
                              onChange={(e)=>setTextArea(e.target.value)}
                          ></textarea>
                           {user ? 
                            <button 
                                className="btn-cm"
                                onClick={saveComment}
                            >Post</button>
                            :
                            <button 
                                className="btn-cm"
                                onClick={
                                    ()=>{
                                        navigate('/Login')
                                    }
                                }
                            >Sign In to Post
                            </button>
                            }
                          
                          </form>
                      </div>
                  </div> 
                </HelmetProvider>
        </>
     );
}


export default Movie;
const media = {
  desktop: (...args) => css`
    @media (min-width: 1095px) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (max-width: 1094px) and (min-width: 768px) {
      ${css(...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: 780px) {
      ${css(...args)}
    }
  `,
  cellphone: (...args) => css`
  @media (max-width: 590px)  {
    ${css(...args)}
  }
`,
};

const theme = {
  media
};

export const MovieCard = styled.div`
    font: "Lato", Arial, sans-serif;
    color: #A9A8A3;
    padding: 40px 0;
    
`
export const Container = styled.div`
    margin: 0 auto;
    width: 1080px;
    height: 600px;
    
    background: #F0F0ED;
    border-radius: 5px;
    position: relative;

    ${props => props.theme.media.desktop`
    
  `}

  ${props => props.theme.media.tablet`
    width: 768px;

    div.overview-column{
      max-width:450px;
    }

    .detalles-titulo{
      padding: 190px 50px 50px 280px;
      position:relative;
    
      div{
        color: white;
        font-size: 34px;
        margin-bottom: 13px;
        text-shadow: 3px 3px 5px black;
        text-transform: uppercase;
      }
      span{
          position: absolute;
          margin-top:15px;
          margin-left: 12px;
          background: #C4AF3D;
          border-radius: 5px;
          color: #544C21;
          font-size: 14px;
          padding: 5px 7px;
        }
    }
   
  `}

  ${props => props.theme.media.mobile`
    width: 580px;

    div.overview-column{
      margin-right:15px;
      max-width:350px;
      overflow-y: hidden;
    }
    div.overview-column:hover{
      max-width:350px;
      
      overflow-y: scroll;
    }

    .detalles-titulo{
      padding: 190px 50px 50px 280px;
      position:relative;
    
      div{
        color: white;
        font-size: 24px;
        margin-bottom: 13px;
        text-shadow: 3px 3px 5px black;
        text-transform: uppercase;
      }
    


      span{
          position: absolute;
          margin-top:15px;
          margin-left: 12px;
          background: #C4AF3D;
          border-radius: 5px;
          color: #544C21;
          font-size: 14px;
          padding: 5px 7px;
        }
      }
  `}

${props => props.theme.media.cellphone`
    width: 400px;
    height: 800px;

   img.cover-poster{
   }
   .summary-container{
    display:flex;
    flex-direction: column;
    height: 450px;
   }
   .tag-genres.tag-generos{
    width: 100%;
   }
   .detalles-titulo{
      padding: 50px 25px 25px 50px;
      position:relative;
    
      div{
      display:flex;
      color: white;
      font-size: 20px;
      margin-bottom: 13px;
      text-shadow: 3px 3px 5px black;
      text-transform: uppercase;
      }
    


      span{
          position: absolute;
          background: #C4AF3D;
          margin-top:55px;
          margin-left:250px;
          border-radius: 5px;
          color: #211f10;
          font-size: 14px;
          padding: 5px 7px;
          
      }
    }
  `}
`
export const Hero = styled.div`
    height: 342px;  
    margin:0;
    position: relative;
    overflow: hidden;
    z-index:1;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    
    &:before {
        content:'';
        width:100%; height:100%;
        position:absolute;
        overflow: hidden;
        top:0; left:0;
        
        background:url( ${props => props.Imagen});
        background-size:cover;
        z-index:-1;
    
        transform: skewY(-2.2deg);
        transform-origin:0 0;
        
        
        backface-visibility: hidden; 
    
  }
`

export const Cover = styled.img`
    position: absolute;
    top: 160px;
    left: 40px;
    z-index: 2;
    width:200px;
`
export const Details = styled.div`
  padding: 190px 50px 50px 280px;
  
  position:relative;
 
`
export const Title1 = styled.div`
    
    color: white;
    font-size: 44px;
    margin-bottom: 13px;
    text-shadow: 3px 3px 5px black;
    text-transform: uppercase;
    
    


    span{
        position: absolute;
        margin-top:15px;
        margin-left: 12px;
        background: #C4AF3D;
        border-radius: 5px;
        color: #544C21;
        font-size: 14px;
        padding: 5px 7px;
        
    }
`

export const Summary = styled.div`
    bottom: 0px;
    height: 200px;
    font-size: 16px;
    line-height: 26px;
    color: #B1B0AC;
    display:flex;


`
export const Column1 = styled.div`
    margin-top:10px;
    padding-left: 50px;
    padding-top: 120px;
    width: 220px;
    float: left;
    text-align: center;
    
    
`
  
export const Column2 = styled.div`
    padding-left: 41px;
    padding-top: 30px;
    margin-left: 20px; 
    width:580px;
    max-width: 700px;
    float: left;
    text-align: justify;
    text-justify: inter-character;
    flex-grow:1;
`
export const Tag = styled.span`
    background: white;
    border-radius: 10px;
    padding: 1px 5px;
    font-size: 11px;
    margin-right: 4px;
    line-height: 20px;
    margin-top: 5px;
    max-height: 22px;
    cursor: pointer;

    &:hover{
        background: #ddd;
    }
`
