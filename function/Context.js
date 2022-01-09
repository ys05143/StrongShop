import React from "react";

export const userContext = React.createContext()
function Context(props){
    const [isNewAlarm, setIsNewAlarm] = React.useState(false);
    
    const value = {
        isNewAlarm,
        setIsNewAlarm,
    }

    return <userContext.Provider value={value}>{props.children}</userContext.Provider>
}

export default Context;