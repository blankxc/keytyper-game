"use client";
import { supabase } from "@/app/api/supabase";
import styles from "@/app/styles/forms.module.scss";
import { FormEvent, useState } from "react";
import bcrypt from 'bcryptjs';
import { useRouter } from "next/navigation";

interface login {
    resultHandler: (arg0: string) => void
}

export default function Login({resultHandler}: login) {
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const router = useRouter()
    async function login(e: FormEvent) {
        e.preventDefault()
        const username: string = await getUsername()
        if (username == 'usernameNotFound' || username == 'errorDb') {
            resultHandler(username)
            return
        }
        const isPasswordTrue: string = await checkPassword(username) 
        if (isPasswordTrue !== 'true') {
            resultHandler(isPasswordTrue)
            return
        }
        const isEncryptionTrue: string = await encryption(username)
        resultHandler(isEncryptionTrue)
    }

    async function encryption(username: string): Promise<string> {
        const {data, error} = await supabase 
        .from('users')
        .select('id')
        .eq('username', username);
        if (error) return 'errorDb'
        const response = await fetch('/api/cookieEncryptor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: data[0].id})
        })
        if (response.ok) {
            router.push('/Game')
            return ''
        }
        return 'Непредвиденная ошибка'
    }

    async function checkPassword(username: string): Promise<string> {
        const {data, error} = await supabase
        .from('users')
        .select('userpassword')
        .eq('username', username);
        if (error) return 'Ошибка базы данных'
        if (data && data.length > 0) {
            const isValid = await bcrypt.compare(passwordInput, data[0].userpassword)
            if (isValid) return 'true'
            if (isValid == false) return 'Неверный пароль'
        }
        return 'Имя пользователя не найдено'
    }

    async function getUsername(): Promise<string> {
        const {data, error} = await supabase
        .from('users')
        .select('username')
        .eq('username', usernameInput);
        
        if (error) return 'Ошибка базы данных'
        if (data && data.length > 0) {
            return data[0].username
        } 
        return 'Имя пользователя не найдено'
    }
    
    return (
        <form action="" onSubmit={login} className={`${styles.form} ${styles.login_form}`}>
            <div className={styles.form_wrapper}>
                <div className={styles.form_item}>
                    <label htmlFor="loginusername">Введите имя</label>
                    <input
                        type="text"
                        id="loginusername"
                        name="loginusername"
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                        />
                </div>
                <div className={styles.form_item}>
                    <label htmlFor="loginpassword">Введите пароль</label>
                    <input
                        type="password"
                        id="loginpassword"
                        name="loginpassword"
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" value="Войти" />
            </div>
        </form>
    );
}
