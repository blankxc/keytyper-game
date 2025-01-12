"use client";
import styles from "@/app/styles/account.module.scss";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/app/api/supabase";

interface mailForm {
    userId: string;
    defaultValue: string;
}

export default function MailForm({ userId, defaultValue }: mailForm) {
    const [inputValue, setInputValue] = useState<string>("");
    useEffect(() => {
        setInputValue(defaultValue);
    }, [defaultValue]);

        async function changeMailHandler(e: FormEvent) {
            e.preventDefault();
            const {data, error} = await supabase
            .from('users')
            .update({usermail: inputValue})
            .eq('id', userId)
            .select();
            if (error) return
            if (!data) return
        }

    return (
        <form action="#" onSubmit={changeMailHandler}>
            <div className={styles.form_wrapper}>
                <div className={styles.form_item}>
                    <label htmlFor="usermail">Изменить электронную почту</label>
                    <input
                        type="mail"
                        id="usermail"
                        name="usermail"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <input type="submit" value="Принять" />
            </div>
        </form>
    );
}
