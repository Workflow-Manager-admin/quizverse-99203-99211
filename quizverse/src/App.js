import React, { useState, useEffect } from "react";
import "./App.css";

// ----- Dummy Data & Utilities (In-Memory Only) -----
const defaultQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    choices: ["Berlin", "London", "Paris", "Madrid"],
    answer: 2,
  },
  {
    id: 2,
    question: "Which language runs in a web browser?",
    choices: ["Java", "C", "Python", "JavaScript"],
    answer: 3,
  },
  {
    id: 3,
    question: "Who wrote 'To Kill a Mockingbird'?",
    choices: [
      "Ernest Hemingway",
      "Harper Lee",
      "Mark Twain",
      "F. Scott Fitzgerald",
    ],
    answer: 1,
  },
  {
    id: 4,
    question: "What does CSS stand for?",
    choices: [
      "Combined Style Sheets",
      "Colored Style Syntax",
      "Cascading Style Sheets",
      "Creative Sheet Style",
    ],
    answer: 2,
  },
  {
    id: 5,
    question: "2 + 2 * 2 = ?",
    choices: ["6", "8", "4", "10"],
    answer: 0,
  },
  {
    id: 6,
    question: "What year did the Apollo 11 land on the moon?",
    choices: ["1972", "1966", "1969", "1958"],
    answer: 2,
  },
  {
    id: 7,
    question: "Who painted the Mona Lisa?",
    choices: [
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
      "Vincent Van Gogh",
    ],
    answer: 1,
  },
];

function getInitialQuestions() {
  // Try from localStorage to persist admin CRUD for demo
  const stored = localStorage.getItem("quizverse_questions");
  return stored ? JSON.parse(stored) : defaultQuestions;
}

function persistQuestions(questions) {
  localStorage.setItem("quizverse_questions", JSON.stringify(questions));
}

// ----- NavBar -----
function NavBar({ mode, onChangeMode, onAdminLogout, isAdminAuthenticated }) {
  return (
    <nav className="navbar bg-[#1A1A1A] border-b border-gray-800 z-50 fixed top-0 left-0 w-full">
      <div className="container flex items-center justify-between mx-auto max-w-4xl">
        <div className="logo flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <span className="logo-symbol text-[#E87A41] text-2xl">★</span> QuizVerse
        </div>
        <div className="flex items-center gap-4">
          {mode === "user" && (
            <button
              className="btn bg-[#E87A41] hover:bg-[#FF8B4D] px-4 py-2 rounded font-medium"
              onClick={() => onChangeMode("admin")}
            >
              Admin Panel
            </button>
          )}
          {mode === "admin" && isAdminAuthenticated && (
            <>
              <button
                className="btn bg-[#E87A41] hover:bg-[#FF8B4D] px-4 py-2 rounded font-medium"
                onClick={onAdminLogout}
              >
                Logout
              </button>
              <button
                className="btn bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded font-medium"
                onClick={() => onChangeMode("user")}
              >
                User Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ----- User Quiz Flow -----
function QuizHome({ onStartQuiz }) {
  return (
    <div className="flex flex-col items-center justify-center mt-32 gap-6">
      <h1 className="title text-4xl sm:text-5xl font-bold text-white mb-2">
        Welcome to <span className="text-[#E87A41]">QuizVerse</span>
      </h1>
      <p className="description text-lg text-gray-300 mb-2 max-w-lg text-center">
        Challenge yourself with a random quiz. After you finish, you'll see your score and can review the correct answers!
      </p>
      <button
        className="btn btn-large bg-[#E87A41] hover:bg-[#FF8B4D] text-lg px-6 py-3 rounded transition"
        onClick={onStartQuiz}
      >
        Start Random Quiz
      </button>
    </div>
  );
}

function shuffleArray(arr) {
  // Fisher-Yates shuffle
  const src = [...arr];
  for (let i = src.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [src[i], src[j]] = [src[j], src[i]];
  }
  return src;
}

function Quiz({
  questions,
  onQuizComplete,
}) {
  // We'll serve 5 random questions per session
  const [quizQuestions] = useState(() => shuffleArray(questions).slice(0, 5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));

  const handleSelect = (choiceIdx) => {
    setAnswers((prev) => {
      const upd = [...prev];
      upd[currentIdx] = choiceIdx;
      return upd;
    });
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((idx) => idx - 1);
    }
  };

  const handleSubmit = () => {
    onQuizComplete(quizQuestions, answers);
  };

  return (
    <div className="container max-w-2xl mt-36 mb-16 flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-center text-[#E87A41] mb-2">Quiz {currentIdx + 1} of {quizQuestions.length}</h2>
      <div className="bg-[#222] rounded-lg shadow-lg px-6 py-6">
        <div className="text-xl font-bold text-white mb-4 min-h-[56px]">{quizQuestions[currentIdx].question}</div>
        <div className="flex flex-col gap-3 mb-6">
          {quizQuestions[currentIdx].choices.map((ch, idx) => (
            <button
              key={idx}
              className={`w-full border px-4 py-3 rounded text-left text-white font-medium transition
                ${
                  answers[currentIdx] === idx
                    ? "bg-[#E87A41] border-[#E87A41]"
                    : "bg-transparent border-gray-800 hover:bg-[#333] hover:border-[#E87A41]"
                }
              `}
              onClick={() => handleSelect(idx)}
            >
              {ch}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            className="btn bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
            onClick={handlePrev}
            disabled={currentIdx === 0}
          >
            Previous
          </button>
          {currentIdx < quizQuestions.length - 1 ? (
            <button
              className="btn bg-[#E87A41] hover:bg-[#FF8B4D] px-4 py-2 rounded"
              onClick={handleNext}
              disabled={answers[currentIdx] == null}
            >
              Next
            </button>
          ) : (
            <button
              className="btn bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={answers.some((a) => a == null)}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizResult({ quizQuestions, answers, onBackHome }) {
  const score = answers.reduce(
    (sum, a, idx) => sum + (a === quizQuestions[idx].answer ? 1 : 0),
    0
  );

  return (
    <div className="container max-w-2xl mt-36 flex flex-col gap-8 items-center">
      <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
      <div className="bg-[#1A2A1A] rounded-lg shadow px-8 py-6 flex flex-col gap-3 items-center">
        <div className="text-lg text-[#E87A41] font-semibold mb-1">
          Your Score: {score} / {quizQuestions.length}
        </div>
      </div>
      <div className="w-full bg-[#222] rounded-lg px-6 py-5 mt-3 mb-4">
        <h3 className="text-xl text-white font-bold mb-5">Review Answers</h3>
        <ol className="flex flex-col gap-6">
          {quizQuestions.map((q, idx) => (
            <li key={q.id}>
              <div className="font-medium text-white mb-1">
                {idx + 1}. {q.question}
              </div>
              <div>
                {q.choices.map((c, cidx) => (
                  <span
                    key={cidx}
                    className={`
                      inline-block px-4 py-2 rounded mr-2 mb-1
                      ${q.answer === cidx
                        ? "bg-green-600 text-white font-bold"
                        : cidx === answers[idx]
                        ? "bg-[#E87A41] text-white"
                        : "bg-slate-700 text-white"}
                    `}
                  >
                    {c}
                    {q.answer === cidx && " ✓"}
                    {answers[idx] === cidx && q.answer !== cidx && " ✗"}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <button
        className="btn bg-[#E87A41] hover:bg-[#FF8B4D] px-5 py-2 rounded text-lg"
        onClick={onBackHome}
      >
        Back to Home
      </button>
    </div>
  );
}

// ----- Admin Panel -----
const ADMIN_PASS = "quizverse123";

function AdminLogin({ onLogin, loginError }) {
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) onLogin(password);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131313]">
      <form
        className="bg-[#19191b] shadow-xl rounded-xl px-10 py-10 flex flex-col gap-4 w-[340px]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-[#E87A41] text-center">Admin Login</h2>
        <label className="text-slate-200 text-base font-medium" htmlFor="admin-password">
          Password:
        </label>
        <input
          id="admin-password"
          type="password"
          className="border border-gray-700 bg-[#222] px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E87A41]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
        />
        {loginError && (
          <div className="text-red-400 text-sm text-center">❌ Incorrect password.</div>
        )}
        <button
          type="submit"
          className="btn btn-large bg-[#E87A41] hover:bg-[#FF8B4D] py-2 text-lg rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

// Admin question form used for both create and edit.
function AdminQuestionForm({ onSave, onCancel, initValue }) {
  const [form, setForm] = useState(
    initValue || {
      question: "",
      choices: ["", "", "", ""],
      answer: 0,
    }
  );
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChoice = (idx, value) => {
    setForm((prev) => {
      const nextChoices = [...prev.choices];
      nextChoices[idx] = value;
      return { ...prev, choices: nextChoices };
    });
  };
  const handleAnswer = (e) => {
    setForm({ ...form, answer: Number(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.question.trim() ||
      form.choices.some((ch) => !ch.trim()) ||
      isNaN(form.answer) ||
      form.answer < 0 ||
      form.answer > 3
    ) {
      setError("Please fill all fields and select a valid correct answer.");
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#23242b] shadow rounded-lg p-6 w-full max-w-lg flex flex-col gap-5 mx-auto"
    >
      <h3 className="text-xl font-bold text-[#E87A41]">{initValue ? "Edit Question" : "Add Question"}</h3>
      <div>
        <label className="font-medium text-slate-200">Question Text</label>
        <input
          className="border border-gray-700 bg-[#222] w-full px-3 py-2 rounded mt-1 text-white focus:outline-none focus:ring-2 focus:ring-[#E87A41]"
          type="text"
          name="question"
          value={form.question}
          onChange={handleChange}
          maxLength={200}
          required
        />
      </div>
      <div>
        <label className="font-medium text-slate-200">Choices</label>
        {form.choices.map((ch, idx) => (
          <div className="flex items-center gap-2 mt-2" key={idx}>
            <input
              className="border border-gray-700 bg-[#222] px-3 py-2 rounded text-white w-full focus:outline-none focus:ring-2 focus:ring-[#E87A41]"
              type="text"
              value={ch}
              maxLength={80}
              onChange={(e) => handleChoice(idx, e.target.value)}
              required
            />
            <input
              type="radio"
              name="correct"
              value={idx}
              checked={form.answer === idx}
              onChange={handleAnswer}
              className="accent-[#E87A41] scale-125 ml-1"
            />
            <span className="text-xs text-gray-400">
              Correct
            </span>
          </div>
        ))}
      </div>
      {error && <div className="mb-2 text-sm text-red-400">{error}</div>}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="btn bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn bg-[#E87A41] hover:bg-[#FF8B4D] px-4 py-2 rounded"
        >
          {initValue ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
}

function AdminPanel({
  questions,
  onQuestionsChange,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (q) => {
    setEditing(q);
    setShowForm(true);
  };

  const handleDelete = (qid) => {
    if (
      window.confirm("Are you sure you want to delete this question?")
    ) {
      const updated = questions.filter((q) => q.id !== qid);
      onQuestionsChange(updated);
    }
  };

  const handleFormSave = (form) => {
    let updated = [];
    if (editing) {
      updated = questions.map((q) =>
        q.id === editing.id
          ? { ...editing, ...form }
          : q
      );
    } else {
      const nextId =
        Math.max(...questions.map((q) => q.id), 0) + 1;
      updated = [
        ...questions,
        { ...form, id: nextId },
      ];
    }
    onQuestionsChange(updated);
    setShowForm(false);
    setEditing(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="container max-w-3xl mt-36 mb-16">
      <h2 className="text-3xl font-bold mb-4 text-[#E87A41]">Admin - Question Management</h2>
      {showForm ? (
        <AdminQuestionForm
          onSave={handleFormSave}
          onCancel={handleCancel}
          initValue={editing}
        />
      ) : (
        <>
          <button
            className="btn btn-large bg-[#E87A41] hover:bg-[#FF8B4D] mb-6 px-5 py-2 rounded"
            onClick={handleAdd}
          >
            Add New Question
          </button>
          <div className="overflow-x-auto mt-2">
            <table className="w-full table-auto border border-gray-800 rounded shadow">
              <thead className="bg-[#232324] text-[#E87A41]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Question</th>
                  <th className="px-4 py-3 text-left font-semibold">Choices</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-5">No questions added yet.</td>
                  </tr>
                )}
                {questions.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-gray-800 hover:bg-[#19191b] transition"
                  >
                    <td className="px-4 py-3 font-mono">{q.id}</td>
                    <td className="px-4 py-3">{q.question}</td>
                    <td className="px-4 py-3">
                      <ol className="pl-4 list-decimal">
                        {q.choices.map((ch, idx) => (
                          <li
                            key={idx}
                            className={
                              idx === q.answer
                                ? "font-bold text-[#E87A41]"
                                : "text-white"
                            }
                          >
                            {ch}
                            {idx === q.answer && (
                              <span className="ml-2 text-xs text-green-400 font-normal">
                                (correct)
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="btn bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                          onClick={() => handleEdit(q)}
                          aria-label="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                          onClick={() => handleDelete(q.id)}
                          aria-label="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ----- Main App Container -----
function App() {
  // Modes: user (main experience) | admin (admin panel)
  const [mode, setMode] = useState("user");

  // Admin authentication control
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState(false);

  // Questions state (simulate DB)
  const [questions, setQuestions] = useState(getInitialQuestions);

  // User quiz flow state
  const [quizState, setQuizState] = useState({
    stage: "home", // home | quiz | result
    quizQuestions: [],
    quizAnswers: [],
  });

  // Sync questions to localStorage (simulate persistence)
  useEffect(() => {
    persistQuestions(questions);
  }, [questions]);

  const handleStartQuiz = () => {
    setQuizState({
      stage: "quiz",
      quizQuestions: [],
      quizAnswers: [],
    });
  };

  const handleQuizComplete = (quizQuestions, answers) => {
    setQuizState({
      stage: "result",
      quizQuestions: quizQuestions,
      quizAnswers: answers,
    });
  };

  const handleBackHome = () => {
    setQuizState({ stage: "home", quizQuestions: [], quizAnswers: [] });
  };

  const handleAdminLogin = (password) => {
    if (password === ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      setAdminLoginError(false);
    } else {
      setAdminLoginError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminLoginError(false);
    setMode("user");
  };

  // Main Render Routing
  return (
    <div className="app min-h-screen flex flex-col bg-[#1A1A1A]">
      <NavBar
        mode={mode}
        onChangeMode={setMode}
        onAdminLogout={handleAdminLogout}
        isAdminAuthenticated={isAdminAuthenticated}
      />
      <main className="flex-1 pt-[90px] px-2">
        {/* User Quiz Flow */}
        {mode === "user" && (
          <>
            {quizState.stage === "home" && (
              <QuizHome onStartQuiz={handleStartQuiz} />
            )}
            {quizState.stage === "quiz" && (
              <Quiz
                questions={questions}
                onQuizComplete={handleQuizComplete}
              />
            )}
            {quizState.stage === "result" && (
              <QuizResult
                quizQuestions={quizState.quizQuestions}
                answers={quizState.quizAnswers}
                onBackHome={handleBackHome}
              />
            )}
          </>
        )}
        {/* Admin Panel */}
        {mode === "admin" && !isAdminAuthenticated && (
          <AdminLogin
            onLogin={handleAdminLogin}
            loginError={adminLoginError}
          />
        )}
        {mode === "admin" && isAdminAuthenticated && (
          <AdminPanel
            questions={questions}
            onQuestionsChange={setQuestions}
          />
        )}
      </main>
      <footer className="bg-[#181818] text-center text-gray-500 text-xs py-4">
        QuizVerse &copy; {new Date().getFullYear()} &mdash; Made with <span className="text-[#E87A41]">React</span> +
        <span className="text-[#E87A41]"> Tailwind CSS</span>
      </footer>
    </div>
  );
}

export default App;
