'use client'
import Login from "./login/login";
import Registration from "./registration/registration";
// import { supabase } from "@/app/api/supabase";
import styles from '@/app/styles/forms.module.scss'
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
// import ResultsHandler from "./ResultsHandler/ResultHandler";

export default function Collector() {
    const [needReg, setNeedReg] = useState<boolean>(false)
    const [needHandler, setNeedHandler] = useState<boolean>(false)
    const [resultCode, setResultCode] = useState<string>('fcsdhgbfjn')
    const [isMessageGood, setIsMessageGood] = useState<boolean>(false)
    function resultsHandler(resCode: string) {
        if (resCode == 'Регистрация прошла успешно') {
            setIsMessageGood(true)
        } else {
            setIsMessageGood(false)
        }
        setResultCode(resCode)
        setNeedHandler(true)
        setTimeout(() => {
            setNeedHandler(false)
        }, 5000)
    }

    return (
        <main className={styles.forms_main}>
            <div className={styles.all_forms_wrapper}>
                {needHandler ? <div className={`${styles.results_message_} ${isMessageGood ? styles.results_message_success : styles.results_message_false}`}>{resultCode}</div> : ''}
                {needReg ? 
                <Registration resultsHandler={resultsHandler}/>
            :
                <Login resultHandler={resultsHandler}/>
            }
                <div className={styles.tools}>
                    <button className={styles.tools_item} onClick={() => setNeedReg(!needReg)}>{needReg ? 'Войти' : 'Зарегестрироваться'}</button>
                    <Link className={styles.tools_item} href='#'>Забыли пароль?</Link>         
                </div>
            </div>
        </main>
    );
}
