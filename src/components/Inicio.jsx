import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Inicio = ({popMovies,popTvShows}) => {

  

    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'


    return ( 
        <>
        <Contenedor>
        <h1>Top Movies</h1>
            {popMovies.map((movie) => (
                <Link to={`/Movies/${movie.id}`}  key={movie.id}>
                  <DisplayMovies 
                  >
                      
                      <img src={`${IMG_PATH}${movie.poster_path}`} alt={movie.title}/>
                      <div>{movie.title}</div>
                  
                  </DisplayMovies>
                  </Link>
              ))}
            <h1>Top TvShows</h1>
            {popTvShows.map((show) => (
              <Link to={`/TvShow/${show.id}`}  key={show.id}>
                  <DisplayTvShows 
                      key={show.id} 
                  >
                      
                      <img src={`${IMG_PATH}${show.poster_path}`} alt={show.name}/>
                      <div>{show.name}</div>
                  </DisplayTvShows>
                </Link>
            ))}
        </Contenedor>
        </>
     );
}
//

export default Inicio;


export const Contenedor = styled.main`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px; /* Added to limit width */
  margin: 0 auto; /* Center horizontally */
  background-color: #eeeeee;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin-top:40px;
  margin-bottom:40px;

  & h1{
    width: 100%;
    font-size: 40px;
    font-weight: normal;
    color: #000;
    margin-top: 15px;
    padding: 10px;
  }
  
`;
export const DisplayMovies = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;

  width: 200px; /* Decreased width */
  height: 320px; /* Decreased height */
  margin: 20px;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */

  & img {

    max-width: 100%;
    width: 200px; /* Decreased width */
    height: 280px; /* Decreased height */
    object-fit: cover;
  }

  & div {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    background-color: #fff;
    border-top: 1px solid #eee;
    width: 100%;
    height: 40px;
  }

  & div span {
    font-size: 14px;
    font-weight: normal;
    color: #667;
    margin-top: 5px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const DisplayTvShows = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;

  width: 200px; /* Decreased width */
  height: 320px; /* Decreased height */
  margin: 20px;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */

  & img {

    max-width: 100%;
    width: 200px; /* Decreased width */
    height: 280px; /* Decreased height */
    object-fit: cover;
  }

  & div {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    background-color: #fff;
    border-top: 1px solid #eee;
    width: 100%;
    height: 40px;
  }

  & div span {
    font-size: 14px;
    font-weight: normal;
    color: #667;
    margin-top: 5px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

