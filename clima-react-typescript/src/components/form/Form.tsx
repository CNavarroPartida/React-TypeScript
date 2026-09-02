import {type ChangeEvent, type FormEvent, useState} from "react";
import type {SearchType} from "../../types";
import {countries} from "../../data/countries.ts";
import styles from './Form.module.css'
import Alert from "../alert/Alert.tsx";

type FormProps = {
    fetchWeather: (search: SearchType) => Promise<void>
}

export default function Form({ fetchWeather }: FormProps) {

    const [search, setSearch] = useState<SearchType>({
        city: "",
        country: "",
    });

    const [alert, setAlert] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(Object.values(search).includes('')) {
            setAlert('Todos los campos son obligatorios');
            return
        }

        fetchWeather(search);
    }

    return (
        <form  onSubmit={handleSubmit} className={styles.form}>
            {alert && <Alert>{alert}</Alert>}
            <div className={styles.field}>
                <label htmlFor="city">Ciudad:</label>
                <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    value={search.city}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="country">Pais:</label>
                <select id="country" value={search.country} name="country" onChange={handleChange}>
                    <option value="">--Seleccione un pais ---</option>
                    {countries.map((country) => (
                        <option
                            key={country.code}
                            value={country.code}
                        >{country.name}</option>
                    ))}
                </select>
            </div>
            <input className={styles.submit} type="submit" value="Consultar Clima" />
        </form>
    )
}
