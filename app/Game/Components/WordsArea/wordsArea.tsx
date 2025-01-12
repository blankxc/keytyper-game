"use client";
import styles from "@/app/styles/game.module.scss";
import { useRef, useEffect } from 'react';

interface wordsArea {
    words: string[][];
    isGameActive: boolean
    guessedWords: string[];
    inputHandler: (key: string) => void
}

export default function WordsArea({
    words,
    isGameActive,
    guessedWords,
    inputHandler
}: wordsArea) {
  const wordsAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isGameActive) wordsAreaRef.current?.focus() 
  }, [isGameActive])
    return (
        <div
            className={styles.words_area}
            ref={wordsAreaRef}
            tabIndex={0}
            onKeyDown={(e) => inputHandler(e.key)}>
            {guessedWords.map((el, index) => {
                return (
                    <span className={styles.entered_letter} key={index}>
                        {el}
                    </span>
                );
            })}
            {words.map((el, index) => {
                return (
                    <span key={index} className={styles.strings}>
                        <span>{el}</span> <br />
                    </span>
                );
            })}
        </div>
    );
}
