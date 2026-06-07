import {type ChangeEvent, type SubmitEvent, useEffect, useState} from "react";
import {categories} from "../data/categories.ts";
import type {DraftExpense, Value} from "../types";
import DatePicker from 'react-date-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage.tsx";

import {useBudget} from "../hooks/useBudget.ts";


export default function ExpenseForm() {

    const initialState :DraftExpense = {
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date(),
    }
    const [expense, setExpense] = useState<DraftExpense>(initialState);
    const [error, setError] = useState('');
    const [previesAmount, setPreviesAmount] = useState(0);
    const {dispatch, state, remainingBudget} = useBudget();

    useEffect(() => {
        if(state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0];
            setExpense(editingExpense);
            setPreviesAmount(editingExpense.amount);
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        const isAmountFiel = ['amount'].includes(name)

        setExpense({
            ...expense,
            [name]: isAmountFiel ? +value : value,
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        //Validando campos
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return
        }

        if( (expense.amount - previesAmount) > remainingBudget){
            setError('Ese gasto se sale del presupuesto')
            return
        }

        //Guardar o actualizar
        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload: {expense}})
        }

        setExpense(initialState)
        setPreviesAmount(0)
    }


    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend
                className="uppercase text-center text-2xl font-black border-b-6 border-blue-500 py-2"
            >{state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}</legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl"
                >Nombre Gasto:</label>
                <input
                    id="expenseName"
                    type="text"
                    name="expenseName"
                    placeholder="Añade el Nombre del Gasto"
                    className="bg-slate-100 p-2"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl"
                >Cantidad:</label>
                <input
                    id="amount"
                    type="number"
                    name="amount"
                    placeholder="Añade la cantidad del gasto"
                    className="bg-slate-100 p-2"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl"
                >Categoria:</label>
                <select
                    id="category"
                    name="category"
                    className="bg-slate-100 p-2"
                    onChange={handleChange}
                    value={expense.category}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl"
                >Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={ e => handleChangeDate(e)}
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase
                font-bold rounded-lg"
                value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
            />
        </form>
    )
}
