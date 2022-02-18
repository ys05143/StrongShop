import React from "react";

export const userContext = React.createContext()
function Context(props){
    const [isNewAlarm, setIsNewAlarm] = React.useState(false);
    const [careSearch, setCareSearch] = React.useState('');
    const [newCarPackageSearch, setNewCarPackageSearch] = React.useState(null);
    const value = {
        isNewAlarm,
        setIsNewAlarm,
        careSearch,
        setCareSearch,
        newCarPackageSearch,
        setNewCarPackageSearch,
    }

    return <userContext.Provider value={value}>{props.children}</userContext.Provider>
}

export default Context;