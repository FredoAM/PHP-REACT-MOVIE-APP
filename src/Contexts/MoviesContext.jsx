import React, { useContext, useState} from "react"


// Creamos el contexto;
const MoviesContext = React.createContext();

// Hook para acceder al contexto
const useMovies =  () => useContext(MoviesContext);


const MoviesProvider = ({children}) => {

  const [movies, setMovies] = useState([]);
  
  const [searchQuery , changeSearchQuery] = useState('');

  const [favs , setFavs] = useState(null);

  const value = {
    movies,
    setMovies,
    searchQuery,
    changeSearchQuery,
    favs
    , setFavs
    // setSearchValue,
    // searchValue
  }


	return (
		<MoviesContext.Provider value={value}>
			{children}
		</MoviesContext.Provider>
	);
}
 
export {MoviesProvider, MoviesContext, useMovies};