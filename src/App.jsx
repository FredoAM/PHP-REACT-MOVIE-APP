import React,{useState,useEffect} from 'react'
import {Header,Inicio} from './components'

function App() {

  

  const [popMovies, setPopMovies] = useState([]);
  const [popTvShows, setPopTvShows] = useState([]);
  

  
  ///discover/movie?sort_by=popularity.desc




    useEffect(() => {

      const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
      const getPopMovies = async () =>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
        const data = await response.json();
        const popular = data.results 
        popular.length = 10;
        setPopMovies(popular);
        
      }
        getPopMovies()
      
      
    }, []);

    useEffect(() => {

      const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
      const getPopMovies = async () =>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
        const data = await response.json();
        const popular = data.results 
        popular.length = 10;
        setPopTvShows(popular);
        
      }
        getPopMovies()
      
      
    }, []);



  return (
    <>
      <Inicio
        popMovies={popMovies}
        popTvShows={popTvShows}
      />
    </>
  )
}

export default App


