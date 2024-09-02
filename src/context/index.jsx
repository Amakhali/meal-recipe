/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const GlobalContext = createContext(null);


export default function GlobalState({ children }) {

    const [searchParam, setSearchParm] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipeList, setRecipeList] = useState([]);
    const [recipeDetailsData, setRecipeDetailsData] = useState(null);
    const [favouriteList, setFavouriteList] = useState([]);
    
    const navigate = useNavigate();

    async function handleSubmit(event) {
        setLoading(true);
        event.preventDefault()
        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`)
            const data = await res.json()

            if (data?.data?.recipes) {
                setRecipeList(data?.data?.recipes)
                setLoading(false);
                setSearchParm('');
                navigate('/')
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            setSearchParm('')
        }
    }

    function handleAddToFavourite(getCurrentItem) {
        let copyFavourite = [...favouriteList];
        const index = copyFavourite.findIndex((item)=> item.id === getCurrentItem.id);

        if(index === -1){
            copyFavourite.push(getCurrentItem)
        } else {
            copyFavourite.splice(index)
        }
        setFavouriteList(copyFavourite)
    }

    return (
        <GlobalContext.Provider value={{
            searchParam, loading, recipeList,
            setSearchParm, handleSubmit, recipeDetailsData, 
            setRecipeDetailsData, handleAddToFavourite, favouriteList
        }}>
            {children}
        </GlobalContext.Provider>
    );
}