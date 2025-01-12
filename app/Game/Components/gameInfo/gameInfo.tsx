import styles from '@/app/styles/game.module.scss'

interface gameInfo {
    displayTimer: number;
    wpmValue: number;
    isNeedWpm: boolean;
}

export default function GameInfo({displayTimer, wpmValue, isNeedWpm}: gameInfo) {
    return (
        <section className={styles.game_controls}>
            <p className={styles.display_timer}>{displayTimer}</p>
            {isNeedWpm ?
            <div className={styles.wps_cont}>
                <p className={styles.wps_title}>WPM</p>
                <p className={styles.wps_hint}>words per minute</p>
                <p className={styles.wps_value}>{wpmValue}</p>
            </div>
            : ''}
        </section>
)
}