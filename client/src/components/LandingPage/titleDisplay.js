import React, { useEffect } from "react";
import { useState } from "react";

export default function TitleDisplay() {
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [charIndex, setCharIndex] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const parsedAnswer = "Unclusterd"; // Use a string

    useEffect(() => {
        let charInterval;
        setIsTypingComplete(false); // Typing is not complete initially
        charInterval = setInterval(() => {
            if (charIndex < parsedAnswer.length) {
                setCurrentAnswer((prevAnswer) => prevAnswer + parsedAnswer[charIndex]);
                setCharIndex(charIndex + 1);
            } else {
                clearInterval(charInterval);
                setIsTypingComplete(true); // Typing is complete when all characters are shown
            }
        }, 80);
        return () => {
            clearInterval(charInterval);
        };
    }, [charIndex, parsedAnswer]);

    return (
        <div className="typewriter">
            <h1 className="name" style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1" }}>
                {currentAnswer}
            </h1>
        </div>
    );
}
