import React, { useState, useEffect } from "react";
import Questions from "./question.json";
import Answers from "./answers.json";

const questionsArray = Object.keys(Questions).map((key) => {
  const item = Questions[key];
  return {
    number: key,
    question: item.question,
    answers: item.answers,
    correct: Answers[key],
  };
});

const QUESTIONS_DB = questionsArray;

function getRandomQuestions(questions, count) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Componente principal de la app.
 */
function QuizApp() {
  const [quizQuestions, setQuizQuestions] = useState([]); // Donde guardamos las 30 preguntas aleatorias
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la pregunta actual
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Respuesta que el usuario seleccionó
  const [showResult, setShowResult] = useState(false); // Muestra la validación (correcto/incorrecto)
  const [score, setScore] = useState(0); // Conteo de aciertos
  const [finished, setFinished] = useState(false); // Indica si terminamos la prueba

  // Al montar el componente, elegimos 30 preguntas aleatorias.
  useEffect(() => {
    const randomQs = getRandomQuestions(QUESTIONS_DB, 30);
    setQuizQuestions(randomQs);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setShowResult(false);
    setSelectedAnswer(null);
  }, []);

  /**
   * Maneja la selección de respuesta en la interfaz.
   */
  const handleSelectAnswer = (answerKey) => {
    if (!showResult) {
      setSelectedAnswer(answerKey);
    }
  };

  /**
   * Validar la respuesta seleccionada:
   * - Si es correcta, incrementa el score.
   * - Muestra el resultado (para destacar si es correcto o no).
   */
  const handleValidate = () => {
    if (selectedAnswer) {
      if (selectedAnswer === quizQuestions[currentIndex].correct) {
        setScore(score + 1);
      }
      setShowResult(true);
    }
  };

  /**
   * Continuar a la siguiente pregunta:
   * - Si se acaba la lista, mostrar resultado final.
   * - Si no, resetear estados para la pregunta siguiente.
   */
  const handleNext = () => {
    if (currentIndex === quizQuestions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  /**
   * Reiniciar la prueba:
   * - Vuelve a seleccionar preguntas, limpiar estados y reempezar.
   */
  const handleRestart = () => {
    const randomQs = getRandomQuestions(QUESTIONS_DB, 30);
    setQuizQuestions(randomQs);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  // Si ya finalizamos todas las preguntas, mostramos el porcentaje.
  if (finished) {
    const percentage = ((score / quizQuestions.length) * 100).toFixed(2);
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }} id="app_container">
        <h1>Resultados</h1>
        <p>
          Has conseguido {score} aciertos de {quizQuestions.length} preguntas.
        </p>
        <p>
          <strong>Porcentaje de aciertos:</strong> {percentage}%
        </p>
        <button
          style={{ backgroundColor: "rgb(88, 124, 150)" }}
          className="validate"
          onClick={handleRestart}>
          Volver a realizar la prueba
        </button>
      </div>
    );
  }

  // Si aún hay preguntas que mostrar
  if (quizQuestions.length === 0) {
    // Cargando preguntas o no hay suficientes
    return <div>Cargando preguntas...</div>;
  }

  // Pregunta actual
  const currentQuestion = quizQuestions[currentIndex];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }} id="app_container">
      <h1>Prueba CCSE</h1>
      <p>
        Pregunta {currentIndex + 1} / {quizQuestions.length}
      </p>
      <p style={{ fontSize: "1.5rem" }}>
        <strong>
          {currentQuestion.number}: {currentQuestion.question}
        </strong>
      </p>

      <div>
        {Object.entries(currentQuestion.answers).map(([key, text]) => {
          // Si showResult es true y key === la correcta, la marcamos en verde
          // Si showResult es true y key === la marcada que no es correcta, la marcamos en rojo
          let optionStyle = {};
          if (showResult) {
            if (key === currentQuestion.correct) {
              optionStyle = {
                backgroundColor: "#b7ffb7",
              }; // verde claro
            } else if (
              key === selectedAnswer &&
              key !== currentQuestion.correct
            ) {
              optionStyle = {
                backgroundColor: "#ffb7b7",
              }; // rojo claro
            }
          }

          return (
            <button
              key={key}
              style={{
                fontSize: "1.1rem",
                display: "block",
                margin: "8px 0",
                padding: "8px",
                borderRadius: 5,
                width: "100%",
                textAlign: "left",
                ...(selectedAnswer === key
                  ? {
                      border: "2px solid rgb(0, 115, 197)",
                      backgroundColor: "rgb(163, 196, 219)",
                    }
                  : {}),
                ...optionStyle,
              }}
              onClick={() => handleSelectAnswer(key)}
              disabled={showResult} // no permitir cambios si ya se mostró el resultado
            >
              <strong>{key.toUpperCase()}.</strong> {text}
            </button>
          );
        })}
      </div>

      {!showResult ? (
        <button
          style={{ backgroundColor: "rgb(88, 150, 88)" }}
          className="validate"
          onClick={handleValidate}
          disabled={!selectedAnswer}>
          VALIDAR
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="validate"
          style={{ backgroundColor: "rgb(88, 124, 150)" }}>
          CONTINUAR
        </button>
      )}
    </div>
  );
}

export default QuizApp;
