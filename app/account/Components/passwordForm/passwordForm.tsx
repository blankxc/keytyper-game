"use client";
import styles from "@/app/styles/account.module.scss";
import { supabase } from "@/app/api/supabase";
import bcrypt from "bcryptjs";
import { FormEvent, useState } from "react";

interface passwordForm {
    userId: string;
}

export default function PasswordForm({ userId }: passwordForm) {
    const [inputValue, setInputValue] = useState<string>("");

    async function changePasswordHandler(e: FormEvent) {
        e.preventDefault()
        const hashedPassword = await bcrypt.hash(inputValue, 10);
        const {data, error} = await supabase
        .from('users')
        .update({userpassword: hashedPassword})
        .eq('id', userId)
        .select();
        if (error) return
        if (!data) return
    }

    return (
        <form action="#" onSubmit={changePasswordHandler}>
            <div className={styles.form_wrapper}>
                <div className={styles.form_item}>
                    <label htmlFor="userpassword">Изменить пароль</label>
                    <input
                        type="password"
                        id="userpassword"
                        name="userpassword"
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <input type="submit" value="Принять" />
            </div>
        </form>
    );
}
