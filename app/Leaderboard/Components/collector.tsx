import Table from "./table/table";
import Mods from "./mods/mods";
import styles from '@/app/styles/leaders.module.scss'

export default function Collector() {
    return (
        <main>
            <div className={styles.main_wrapper}>
                <Mods />
                <Table />
            </div>
        </main>
    );
}
