import {useContext} from "react";
import {ActivityContext} from "../context/activityContext.tsx";

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if(!context){
        throw new Error("useActivity must be used within the context");
    }
    return context;
}