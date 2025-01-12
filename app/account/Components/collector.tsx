"use client";
import { useEffect, useState } from "react";
import styles from "@/app/styles/account.module.scss";
import NameForm from "./nameForm/nameForm";
import MailForm from "./mailForm/mailForm";
import PasswordForm from "./passwordForm/passwordForm";
import { supabase } from "@/app/api/supabase";
import { useRouter } from "next/navigation";

export default function Collector() {
    const router = useRouter();
    const [userToken, setUserToken] = useState<string>("");
    const [defaultUsername, setDefaultUsername] = useState<string>("");
    const [defaultUserMail, setDefaultUserMail] = useState<string>("");

    async function getCookies() {
        const response = await fetch("/api/cookieDecryptor", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        async function fetchCookies() {
            const token = await getCookies();
            if (token.token == undefined) {
                return;
            }

            setUserToken(token.token);
        }

        fetchCookies();
    }, []);

    useEffect(() => {
        async function getUserInfo() {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userToken);

            if (error) return;
            if (data.length > 0) {
                setDefaultUsername(data[0].username);
                setDefaultUserMail(data[0].usermail);
            }
            return;
        }

        getUserInfo();
    }, [userToken]);

    async function deleteCookie() {
        const response = await fetch("/api/cookieDeleter", { method: "POST" });
        if (response.ok) {
            router.push("/logreg");
        }else {
            console.error('Ошибка при удалении куки:', response.statusText);
          }
    }

    return (
        <main>
            <div className={styles.main_wrapper}>
                <section className={styles.forms}>
                    <NameForm
                        userId={userToken}
                        defaultValue={defaultUsername}
                    />
                    <MailForm
                        userId={userToken}
                        defaultValue={defaultUserMail}
                    />
                    <PasswordForm userId={userToken} />
                    <button
                        className={styles.exit_account_btn}
                        onClick={deleteCookie}>
                        Выйти
                    </button>
                </section>
            </div>
        </main>
    );
}
