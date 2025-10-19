"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<{ num1: number; num2: number; operator: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem("userId")) {
      router.push("/login");
      return;
    }

    // Generate a random math puzzle
    generatePuzzle();
  }, [router]);

  function generatePuzzle() {
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1: number;
    let num2: number;
    
    // Generate numbers based on operator
    if (operator === "+") {
      num1 = Math.floor(Math.random() * 50) + 10; // 10-59
      num2 = Math.floor(Math.random() * 50) + 10; // 10-59
    } else if (operator === "-") {
      num1 = Math.floor(Math.random() * 50) + 30; // 30-79
      num2 = Math.floor(Math.random() * 20) + 10; // 10-29
    } else { // multiplication
      num1 = Math.floor(Math.random() * 12) + 2; // 2-13
      num2 = Math.floor(Math.random() * 12) + 2; // 2-13
    }
    
    setPuzzle({ num1, num2, operator });
  }

  function calculateCorrectAnswer(): number {
    if (!puzzle) return 0;
    
    let actualAnswer: number;
    if (puzzle.operator === "+") {
      actualAnswer = puzzle.num1 + puzzle.num2;
    } else if (puzzle.operator === "-") {
      actualAnswer = puzzle.num1 - puzzle.num2;
    } else { // ×
      actualAnswer = puzzle.num1 * puzzle.num2;
    }
    
    // The unlock answer is 13 more than the actual answer
    return actualAnswer + 13;
  }

  function handleSubmit() {
    if (!answer.trim()) {
      return;
    }

    const userAnswer = parseInt(answer, 10);
    if (isNaN(userAnswer)) {
      setAnswer("");
      return;
    }

    const correctAnswer = calculateCorrectAnswer();
    
    if (userAnswer === correctAnswer) {
      // Success! Store unlock token and redirect to chat
      localStorage.setItem("unlocked", "true");
      router.push("/chat");
    } else {
      // Check if user gave the actual mathematical answer
      const actualMathAnswer = calculateCorrectAnswer() - 13;
      
      if (userAnswer === actualMathAnswer) {
        // Show "Correct answer!" and generate new puzzle
        setAttempts(attempts + 1);
        setError("Correct answer!");
        setAnswer("");
        // Generate new puzzle after a brief moment
        setTimeout(() => {
          generatePuzzle();
          setError("");
        }, 1000);
      } else {
        // Wrong answer (not the math answer, not the unlock answer)
        setError("Wrong answer");
        setAnswer("");
        setTimeout(() => {
          setError("");
        }, 1000);
      }
    }
  }

  if (!puzzle) {
    return (
      <main className="min-h-dvh grid place-items-center p-6 bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6 bg-gray-950 text-white">
      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl bg-gray-900/50 border border-gray-800 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Puzzle Gate
          </h1>
          <p className="text-gray-400 text-sm">
            Solve the puzzle to unlock CipherTalk
          </p>
        </div>

        <div className="p-8 rounded-xl bg-gray-800/50 border border-gray-700">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm uppercase tracking-wide">What is</p>
            <div className="text-6xl font-bold text-white">
              {puzzle.num1} {puzzle.operator} {puzzle.num2}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white placeholder-gray-500 text-lg text-center"
            autoFocus
          />

          {error && (
            <div className={`px-4 py-3 rounded-lg text-sm text-center ${
              error === "Correct answer!" 
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            Unlock
          </button>
        </div>

      </div>
    </main>
  );
}
