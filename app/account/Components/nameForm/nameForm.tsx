"use client";
import styles from "@/app/styles/account.module.scss";
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from "@/app/api/supabase";

interface nameForm {
    userId: string;
    defaultValue: string;
}

export default function NameForm({ userId, defaultValue }: nameForm) {
    const [inputValue, setInputValue] = useState<string>('');
    useEffect(() => {
        setInputValue(defaultValue)
    }, [defaultValue])

    async function changeNameHandler(e: FormEvent) {
        e.preventDefault();
        const {data, error} = await supabase
        .from('users')
        .update({username: inputValue})
        .eq('id', userId)
        .select();
        if (error) return
        if (!data) return
    }

    return (
        <form action="#" onSubmit={changeNameHandler}>
            <div className={styles.form_wrapper}>
                <div className={styles.form_item}>
                    <label htmlFor="username">Изменить имя</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <input type="submit" value="Принять" />
            </div>
        </form>
    );
}
