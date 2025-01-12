'use client'
import styles from '@/app/styles/forms.module.scss'
import { useState } from 'react';
interface resultsHandler {
    resultCode: string
}

export default function ResultsHandler({resultCode}: resultsHandler) {
    const [resultText, setResultText] = useState<string>('gyigbug')
    const [isMessageGood, setIsMessageGood] = useState<boolean>(false)
    setError()

    function setError() {
            if (resultCode == 'errorDb') {
                setIsMessageGood(false)
                setResultText('Ошибка базы данных')
            }
            if (resultCode == 'nameisavailable') {
                setIsMessageGood(false)
                setResultText('Такое имя уже используется')
            }
            if (resultCode == 'mailisavailable') {
                setIsMessageGood(false)
                setResultText('Такая электронная почта уже используется')
            }
            if (resultCode == 'insertError') {
                setIsMessageGood(false)
                setResultText('Ошибка при создании аккаунта, попробуйте еще раз')
            }
            if (resultCode == 'insertTrue') {
                setIsMessageGood(true)
                setResultText('Аккаунт успешно создан')
            }
            if (resultCode == 'unexpectedError') {
                setIsMessageGood(false)
                setResultText('Непредвиденная ошибка')
            }
            if (resultCode == 'usernameNotFound') {
                setIsMessageGood(false)
                setResultText('Имя пользователя не найдено')
            }
            if (resultCode == 'passwordNotValid') {
                setIsMessageGood(false)
                setResultText('Неверный пароль')
            }
    }
    return (
        <div className={`${`styles.results_message_${isMessageGood ? 'success' : 'false'}`} ${styles.results_message_}`}>
            <p>{resultText}</p>
        </div>
    )
}