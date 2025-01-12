"use client";
import styles from "@/app/styles/forms.module.scss";
import { supabase } from "@/app/api/supabase";
import { FormEvent, useState } from "react";
import bcrypt from 'bcryptjs'

interface registration {
    resultsHandler: (arg0: string) => void
}

export default function Registration({resultsHandler}: registration) {
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [mailInput, setMailInput] = useState<string>("");
    async function registration(e: FormEvent) {
        e.preventDefault()
        const isNameAvailable: string = await checkIsUsernameAvailable();
        const isMailAvailable: string = await checkIsMailAvailable()
        if (isNameAvailable != 'true') {
            resultsHandler(isNameAvailable)
            return
        }
        if (isMailAvailable != 'true') {
            resultsHandler(isMailAvailable)
            return
        }
        const isInsertSuccess: string = await insertNewUser()
        if (isInsertSuccess != 'insertTrue') {
            resultsHandler(isInsertSuccess)
        } else {
            resultsHandler(isInsertSuccess)
        }
    }

    interface enTable {
        token: string;
        username: string
    }

    async function insertIntoEnRecords({token, username}: enTable) {
        const {data, error} = await supabase
        .from('en_wpm_records')
        .insert([
            {
                id: token,
                username: username,
                record: 0
            }
        ])
        .select();
        if (error) return
        if (!data) return
    }

    async function insertNewUser(): Promise<string> {
        const hashedPassword = await bcrypt.hash(passwordInput, 10)
        const {data, error} = await supabase
        .from('users')
        .insert([
            {
                username: usernameInput,
                userpassword: hashedPassword,
                usermail: mailInput 
            }
        ])
        .select();
        if (error) return 'Ошибка базы данных'
        if (data && data.length > 0) {
            insertIntoEnRecords(data[0].id, data[0].username)
            return 'Регистрация прошла успешно'
        }

        return 'Непредвиденная ошибка'
    }
    
    async function checkIsUsernameAvailable(): Promise<string> {
        const { data, error } = await supabase
        .from("users")
        .select('*')
        .eq('username', usernameInput);
        if (error) return 'Ошибка базы данных'
        if (data.length > 0) return 'Такое имя уже используется'
        
        return 'true'
    }
    
    async function checkIsMailAvailable(): Promise<string> {
        const { data, error } = await supabase
        .from("users")
        .select('*')
        .eq('username', mailInput);
        if (error) return 'Ошибка базы данных'
        if (data.length > 0) return 'Такая электронная почта уже используется'
        
        return 'true'
    }

    return (
        <form
            action=""
            onSubmit={registration}
            className={`${styles.form} ${styles.reg_form}`}>
            <div className={styles.form_wrapper}>
                <div className={styles.form_item}>
                    <label htmlFor="username">Введите имя</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.form_item}>
                    <label htmlFor="password">Введите пароль</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.form_item}>
                    <label htmlFor="mail">Введите электронную почту</label>
                    <input
                        type="mail"
                        id="mail"
                        name="mail"
                        onChange={(e) => setMailInput(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" value="Зарегестрироваться" />
            </div>
        </form>
    );
}
