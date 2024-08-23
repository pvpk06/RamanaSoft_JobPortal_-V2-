import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import apiService from '../../../apiService';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px'
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  },
  listItem: {
    background: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background 0.3s'
  },
  listItemHover: {
    background: '#f0f0f0'
  },
  paragraph: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    margin: '20px 0'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  }
};

const Quiz = () => {
  const user_id = Cookies.get("internID");
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get(`/user-quizzes/${user_id}`);
        const data = await response.json();

        const assigned = data.filter(quiz => !quiz.status);
        const submitted = data.filter(quiz => quiz.status);

        setAssignedQuizzes(assigned);
        setSubmittedQuizzes(submitted);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user_id]);

  const handleAttemptQuiz = (quizId) => {
    const url = `/quiz/${user_id}/${quizId}`;
    window.open(url, '_blank');
  };

  const handleViewAnalysis = (quizToken) => {
    const url = `/quiz-analysis/${user_id}/${quizToken}`;
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Assigned Quizzes</h2>
      {assignedQuizzes.length > 0 ? (
        <div>
          <h3>Available Quizzes</h3>
          <ul style={styles.list}>
            {assignedQuizzes.map((quiz) => (
              <li
                key={quiz.id}
                style={styles.listItem}
                onMouseEnter={(e) => e.currentTarget.style.background = styles.listItemHover.background}
                onMouseLeave={(e) => e.currentTarget.style.background = styles.listItem.background}
              >
                <p>{quiz.quiz_name}</p>
                <button
                  style={styles.button}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                  onClick={() => handleAttemptQuiz(quiz.token)}
                >
                  Attempt Quiz
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.paragraph}>No quizzes assigned</p>
      )}

      {submittedQuizzes.length > 0 ? (
        <div>
          <h3>Your Submissions</h3>
          <ul style={styles.list}>
            {submittedQuizzes.map((quiz) => (
              <li
                key={quiz.id}
                style={styles.listItem}
                onMouseEnter={(e) => e.currentTarget.style.background = styles.listItemHover.background}
                onMouseLeave={(e) => e.currentTarget.style.background = styles.listItem.background}
              >
                <p>{quiz.quiz_name}</p>
                <button
                  style={styles.button}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                  onClick={() => handleViewAnalysis(quiz.token)}
                >
                  View Analysis
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.paragraph}>No quizzes submitted yet</p>
      )}
    </div>
  );
};

export default Quiz;
