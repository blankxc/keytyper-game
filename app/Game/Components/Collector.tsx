"use client";
import styles from "@/app/styles/game.module.scss";
import WordsArea from "./WordsArea/wordsArea";
import { useEffect, useState } from "react";
import GameInfo from "./gameInfo/gameInfo";
import { supabase } from "@/app/api/supabase";

export default function Collector() {
        const [userToken, setUserToken] = useState<string>("");
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
        const [currentRecord, setCurrentRecord] = useState<number>(0)

        useEffect(() => {
            async function getRecord() {
                const {data, error} = await supabase
                .from('users')
                .select('wpm_record')
                .eq('id', userToken)
    
                if (error) return
                if (data.length > 0) {
                    setCurrentRecord(data[0].wpm_record)
                }
            }

            getRecord()
        }, [userToken])


    const wordsDb: string[] = [
        "dance ",
        "tall ",
        "car ",
        "sorry ",
        "cloud ",
        "quick ",
        "dog ",
        "light ",
        "water ",
        "night ",
        "please ",
        "pink ",
        "house ",
        "happy ",
        "tall ",
        "smart ",
        "pink ",
        "melon ",
        "cloud ",
        "snake ",
        "wind ",
        "pen ",
        "walk ",
        "snake ",
        "go ",
        "day ",
        "apple ",
        "day ",
        "berry ",
        "wind ",
        "cup ",
        "dark ",
        "orange ",
        "peach ",
        "play ",
        "slow ",
        "goodbye ",
        "kind ",
        "red ",
        "banana ",
        "up ",
        "book ",
        "left ",
        "green ",
        "glass ",
        "run ",
        "table ",
        "book ",
        "glass ",
        "right ",
        "mouse ",
        "angry ",
        "down ",
        "dog ",
        "kiwi ",
        "stop ",
        "no ",
        "light ",
        "car ",
        "pen ",
        "slow ",
        "pear ",
        "brown ",
        "banana ",
        "cherry ",
        "mouse ",
        "orange ",
        "horse ",
        "slow ",
        "fish ",
        "small ",
        "green ",
        "grape ",
        "sorry ",
        "cup ",
        "cold ",
        "yes ",
        "write ",
        "read ",
        "white ",
        "fast ",
        "quick ",
        "dark ",
        "cold ",
        "up ",
        "yes ",
        "sand ",
        "no ",
        "fire ",
        "red ",
        "blue ",
        "gray ",
        "swim ",
        "pear ",
        "frog ",
        "thank ",
        "orange ",
        "small ",
        "right ",
        "dance ",
        "kiwi ",
        "dog ",
        "quick ",
        "peach ",
        "dance ",
        "red ",
        "glass ",
        "up ",
        "hot ",
        "sing ",
        "orange ",
        "sorry ",
        "walk ",
        "green ",
        "book ",
        "brown ",
        "dark ",
        "hello ",
        "apple ",
        "cup ",
        "day ",
        "thank ",
        "slow ",
        "stone ",
        "slow ",
        "star ",
        "kind ",
        "orange ",
        "mouse ",
        "fast ",
        "sing ",
        "table ",
        "angry ",
        "sad ",
        "fire ",
        "small ",
        "pink ",
        "cherry ",
        "please ",
        "book ",
        "frog ",
        "cloud ",
        "melon ",
        "swim ",
        "read ",
        "cat ",
        "sand ",
        "stop ",
        "dark ",
        "pear ",
        "chair ",
        "house ",
        "thank ",
        "go ",
        "fire ",
        "run ",
        "chair ",
        "walk ",
        "horse ",
        "left ",
        "wind ",
        "grape ",
        "small ",
        "house ",
        "kind ",
        "lion ",
        "red ",
        "lion ",
        "dog ",
        "stone ",
        "yellow ",
        "glass ",
        "fish ",
        "water ",
        "grape ",
        "snake ",
        "help ",
        "swim ",
        "run ",
        "lamp ",
        "banana ",
        "white ",
        "quick ",
        "pen ",
        "right ",
        "brown ",
        "stop ",
        "right ",
        "wind ",
        "star ",
        "goodbye ",
        "slow ",
        "sand ",
        "bird ",
        "down ",
        "write ",
        "pear ",
        "smart ",
        "cold ",
        "pen ",
    ];

    const [currentLetter, setCurrentLetter] = useState<string>("");
    const [guessedWords, setGuessedWords] = useState<string[]>([]);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [displayTime, setDisplayTime] = useState<number>(60);
    const [wpmValue, setWpmValue] = useState<number>(0);
    const [isNeedWpm, setIsNeedWpm] = useState<boolean>(false);

    const [words, setWords] = useState<string[][]>(
        Array.from({ length: 20 }, () => Array(5).fill(""))
    );

    function randomizer() {
        function getRandomNumber() {
            return Math.floor(Math.random() * wordsDb.length);
        }

        const newWords = words.map((row) => {
            return row.map(() => {
                const randomNumber = getRandomNumber();
                return wordsDb[randomNumber];
            });
        });
        setWords(newWords);
    }

    useEffect(() => {
        if (isGameActive) {
            setIsNeedWpm(false)
            setWpmValue(0);
            randomizer();
            displayTimeChanger();
            setTimeout(() => {
                gameEnd();
            }, 60000);
        }
    }, [isGameActive]);

    function displayTimeChanger() {
        function update() {
            setDisplayTime((current) => current - 1);
        }

        const interval = setInterval(update, 1000);
        setTimeout(() => {
            clearInterval(interval);
            setDisplayTime(60);
        }, 60000);
    }

    async function gameEnd() {
        setIsNeedWpm(true)
        setWords(Array.from({ length: 20 }, () => Array(5).fill("")));
        setGuessedWords([]);
        setIsGameActive(false);
    }
    
    useEffect(() => {
        async function resultsHandler() {
            if (Math.floor(wpmValue / 2) > currentRecord) {
                setCurrentRecord(wpmValue)
                await insertIntoUsers()
                await insertIntoEnRecords()
            }
        }
        
        resultsHandler()
    }, [isGameActive])
    
    async function insertIntoUsers() {
        const {data, error} = await supabase
        .from('users')
        .update({'wpm_record': wpmValue})
        .eq('id', userToken);
        if (error) return
        if (!data) return
    }
    
    async function insertIntoEnRecords() {
        const {data, error} = await supabase
        .from('en_wpm_records')
        .update({'record': wpmValue})
        .eq('id', userToken);
        if (error) return
        if (!data) return
    }

    useEffect(() => {
        if (words[0] && words[0][0]) {
            setCurrentLetter(words[0][0][0]);
        }
    }, [words]);

    function inputHandler(currentKey: string) {
        if (isGameActive) {
            setCurrentLetter(words[0][0][0]);
            if (currentKey == currentLetter) {
                setGuessedWords((prev) => [...prev, currentLetter]);
                setWords((prevWords) => {
                    const newWords = prevWords.map((subArray) => [...subArray]);

                    if (newWords[0] && newWords[0][0]) {
                        newWords[0][0] = newWords[0][0].slice(1);
                    }

                    if (newWords[0][0].length === 0) {
                        newWords[0] = newWords[0].slice(1);
                        setWpmValue((current) => current + 1);
                    }
                    if (newWords[0].length === 0) {
                        newWords.shift();
                        setGuessedWords([]);
                    }
                    return newWords;
                });
            }
        }
    }

    return (
        <main className={styles.main}>
            <GameInfo
                displayTimer={displayTime}
                wpmValue={wpmValue}
                isNeedWpm={isNeedWpm}
            />
            <WordsArea
                words={words}
                isGameActive={isGameActive}
                guessedWords={guessedWords}
                inputHandler={inputHandler}
            />
            {isGameActive == false ? (
                <button
                    className={styles.start_btn}
                    onClick={() => setIsGameActive(true)}>
                    Start
                </button>
            ) : (
                ""
            )}
        </main>
    );
}
