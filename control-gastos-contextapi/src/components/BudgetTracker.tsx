import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import AmountDisplay from "./AmountDisplay.tsx";
import {useBudget} from "../hooks/useBudget.ts";
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {
    const {state, remainingBudget, totalExpenses, dispatch} = useBudget();
    const percentage = +((totalExpenses / state.budget) * 100).toFixed(2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}% Gastado`}
                    styles={
                        buildStyles({
                            pathColor: percentage === 100 ? "#dc2626" : '#3b82f6',
                            trailColor: '#F5F5F5',
                            textSize: 8,
                            textColor: percentage === 100 ? "#dc2626" : '#3b82f6'
                        })
                    }
                />
            </div>

            <div className="flex flex-col justify-center items-center gap8">
                <button
                    type="button"
                    className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
                    onClick={() => {dispatch({type:'clear-app'})}}
                >
                    Resetear App
                </button>

                <AmountDisplay
                    label = "Presupuesto"
                    amount = {state.budget}
                />

                <AmountDisplay
                    label = "Disponible"
                    amount = {remainingBudget}
                />

                <AmountDisplay
                    label = "Gastado"
                    amount ={totalExpenses}
                />
            </div>
        </div>
    )
}
