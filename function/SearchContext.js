//context 사용하려다 안함.
import React from "react";

export const CarNameSearchContext = React.createContext();

function SearchContext(props){
    const search = {
        carName: '',
    }

    return(
        <CarNameSearchContext.Provider value={search}>{props.children}</CarNameSearchContext.Provider>
    )
}

export default SearchContext;