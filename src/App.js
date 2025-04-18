import React, { useState, useEffect } from "react";
import Questions from "./assets/question.json";
import manual from "./assets/manual_CCSE_2025_1.pdf";

const QUESTIONS_DB = Questions;

function getRandomQuestions(questions, count) {
  let selected = [];

  let readyquestiosn = localStorage.getItem("answered_questios") || [];
  if (readyquestiosn.length >= questions.length) {
    localStorage.setItem("answered_questios", []);
    readyquestiosn = [];
  }
  let filtered_questions = questions.filter((item) => {
    return !readyquestiosn.includes(item.number);
  });
  console.log("🚀 ~ filtered_questions:", filtered_questions.length);
  let total_questions = filtered_questions.length;
  let max_number_question = Math.min(total_questions, count);
  for (let index = 0; index < max_number_question; index++) {
    let find = Math.trunc(filtered_questions.length * Math.random()) - 1;
    let new_question = filtered_questions.splice(find, 1);
    selected.push(new_question[0]);
  }

  return selected;
}

function InCorrectIcon() {
  return (
    <svg
      class="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24">
      <path
        fill-rule="evenodd"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
function CorrectIcon() {
  return (
    <svg
      class="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24">
      <path
        fill-rule="evenodd"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function QuizApp() {
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Respuesta que el usuario seleccionó
  const [quizQuestions, setQuizQuestions] = useState([]); // Donde guardamos las 30 preguntas aleatorias
  const [correctQuestions, setCorrectQuestions] = useState([]); // Donde guardamos las 30 preguntas aleatorias
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la pregunta actual
  const [showResult, setShowResult] = useState(false); // Muestra la validación (correcto/incorrecto)
  const [finished, setFinished] = useState(false); // Indica si terminamos la prueba
  const [score, setScore] = useState(0); // Conteo de aciertos

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
        correctQuestions.push(quizQuestions[currentIndex].number);
        setCorrectQuestions([...correctQuestions]);
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
      let readyquestiosn = localStorage.getItem("answered_questios") || [];
      localStorage.setItem("answered_questios", [
        ...readyquestiosn,
        ...correctQuestions,
      ]);
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
        <div class="inline-grid grid-cols-1 gap-4 mt-6 w-full">
          <h1 className="text-3xl font-bold">Resultados</h1>
          <p className="text-xl">
            Has conseguido <strong>{score}</strong> aciertos de{" "}
            <strong>{quizQuestions.length}</strong> preguntas.
          </p>
          <div>
            <p className="text-xl">Porcentaje de aciertos:</p>
            <h1 className="text-3xl font-bold"> {percentage}%</h1>
          </div>
          <button
            className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
            onClick={handleRestart}>
            Volver a realizar la prueba
          </button>
        </div>
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
  console.log("🚀 ~ currentQuestion:", currentQuestion);

  return (
    <div id="app_container">
      <div className="md:flex gap-4 w-full">
        <div style={{ maxWidth: 600 }}>
          <div className="inline-grid grid-cols-1 gap-4 mt-6 w-full">
            <h1 className="text-3xl font-bold">Prueba CCSE</h1>
            <p>
              Pregunta {currentIndex + 1} de {quizQuestions.length}
            </p>
            <p className="text-2xl text-gray-900 dark:text-white">
              <strong>
                {currentQuestion.number}: {currentQuestion.question}
              </strong>
            </p>
          </div>
          <div className="inline-grid grid-cols-1 gap-4 mt-6 w-full">
            {Object.entries(currentQuestion.answers).map(([key, text]) => {
              let className =
                "hover:bg-gray-700 bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-900";
              let icon = null;
              let reference = null;
              if (showResult) {
                if (key === currentQuestion.correct) {
                  className =
                    "bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900";
                  icon = <CorrectIcon />;
                  reference = currentQuestion.reference
                    ? currentQuestion.reference
                    : null;
                  console.log("🚀 ~ reference:", reference);
                } else if (
                  key === selectedAnswer &&
                  key !== currentQuestion.correct
                ) {
                  className =
                    "bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900";
                  icon = <InCorrectIcon />;
                }
              } else {
                if (key === selectedAnswer) {
                  className =
                    "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-700";
                }
              }

              return (
                <button
                  onClick={() => handleSelectAnswer(key)}
                  key={key}
                  type="button"
                  className={`text-left w-full focus:outline-none text-white text-xl font-medium rounded-lg px-5 py-2.5 me-2 mb-2 ${className}`}>
                  <div className="flex items-center">
                    <strong>{key.toUpperCase()}</strong> {`. ${text}`}
                    {icon}
                  </div>
                  {reference && (
                    <p
                      className={`text-left w-full text-white text-md rounded-lg px-5 py-2.5 me-2 mb-2`}>
                      {reference}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          <div className="inline-grid grid-cols-1 gap-4 mt-6 w-full">
            {!showResult ? (
              <button
                className=" w-full text-white bg-yellow-700 hover:bg-yellow-800 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none"
                onClick={handleValidate}
                disabled={!selectedAnswer}>
                VALIDAR
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="  w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
                CONTINUAR
              </button>
            )}
          </div>
        </div>
        <iframe src={manual} className="w-full xs:hidden md:min-h-svh" />
      </div>
    </div>
  );
}

export default QuizApp;
