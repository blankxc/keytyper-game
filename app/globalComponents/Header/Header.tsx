"use client";
import { supabase } from "@/app/api/supabase";
import styles from "@/app/styles/header.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const [userToken, setUserToken] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    async function getCookie() {
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
        async function fetchCookie() {
            const sessionToken = await getCookie();
            if (sessionToken.token === undefined) {
                return;
            }

            setUserToken(sessionToken.token);
        }

        fetchCookie();
    }, []);

    useEffect(() => {
        getUsername();
        console.log(userToken)
        console.log(username)
    }, [userToken]);

    async function getUsername() {
        const { data, error } = await supabase
            .from("users")
            .select("username")
            .eq("id", userToken);
        if (error) return;
        if (data.length > 0) {
            setUsername(data[0].username);
        }
    }


    return (
        <header className={styles.page_header}>
            <div className={styles.page_header_wrapper}>
                <ul className={styles.links_list}>
                    <li>
                        <Link href={"/"} className={styles.header_link}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={"/Leaderboard"}
                            className={styles.header_link}>
                            Leaderboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/Game" className={styles.header_link}>
                            Game
                        </Link>
                    </li>
                </ul>
                {username.length > 0 ? (
                    <p className={styles.username}>
                        <Link
                            href={"/account"}
                            className={styles.username_link}>
                            {username}
                        </Link>
                        <Image
                            src="/userIcon.png"
                            alt="alt"
                            width={20}
                            height={20}
                        />
                    </p>
                ) : (
                    <Link href={'/logreg'}>Login</Link>
                )}
            </div>
        </header>
    );
}
