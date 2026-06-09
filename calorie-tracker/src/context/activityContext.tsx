import {createContext, type Dispatch, useMemo, useReducer} from "react";
import {type ActivityActions, activityReducer, type ActivityState, initialState} from "../reducers/activityReducer.ts";
import type {Activity} from "../types";
import {categories} from "../data/categories.ts";


type ActivityProviderProps = {
    children: React.ReactNode;
}

type ActivityContextProps = {
    state: ActivityState;
    dispatch: Dispatch<ActivityActions>;
    caloriesConsumed : number;
    caloriesBurned: number;
    netCalories: number;
    categoryName : (category: Activity["category"]) => string[];
    isEmptyActivities : boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({children} :ActivityProviderProps) => {

    const [state, dispatch] = useReducer(activityReducer, initialState);

    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total +
        activity.calories : total, 0), [state.activities])

    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total +
        activity.calories : total, 0), [state.activities])

    const netCalories =useMemo( () => caloriesConsumed - caloriesBurned, [caloriesConsumed, caloriesBurned])

    const categoryName = useMemo(() =>
            (category: Activity['category']) => categories.map(cat => cat.id === category ? cat.name : '')
        , [state.activities])

    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])


    return (
        <ActivityContext.Provider value={{
            state,
            dispatch,
            caloriesConsumed,
            caloriesBurned,
            netCalories,
            categoryName,
            isEmptyActivities
        }}>
            {children}
        </ActivityContext.Provider>
    )
}