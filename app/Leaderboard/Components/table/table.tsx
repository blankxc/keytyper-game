"use client";
import { supabase } from "@/app/api/supabase";
import { useEffect, useState } from "react";
import styles from "@/app/styles/leaders.module.scss";

export default function Table() {
    interface elements {
        username: string;
        record: string;
    }
    const [tableElements, setTableElements] = useState<elements[]>([]);

    useEffect(() => {
        getLeaders();
    }, []);

    async function getLeaders() {
        const { data, error } = await supabase
            .from("en_wpm_records")
            .select("*");
        if (error) return;
        data.length = 20
        if (data.length > 0) {
            setTableElements(data);
        }
        return;
    }

    return (
        <section className={styles.table_section}>
            <table className={styles.table}>
                <thead>
                    <tr
                        className={`${styles.table_row} ${styles.table_header_row}`}>
                        <th className={styles.table_header}>position</th>
                        <th className={styles.table_header}>username</th>
                        <th className={styles.table_header}>record</th>
                    </tr>
                </thead>
                <tbody>
                    {tableElements.map((el, index) => {
                        return (
                            <TableComponent
                                key={index}
                                position={++index}
                                username={el.username}
                                record={el.record}
                            />
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}

interface tableComponent {
    position: number;
    username: string;
    record: string;
}

function TableComponent({ position, username, record }: tableComponent) {
    return (
        <tr className={styles.table_row}>
            <td className={styles.table_cell}>{position}</td>
            <td className={styles.table_cell}>{username}</td>
            <td className={styles.table_cell}>{record}</td>
        </tr>
    );
}
