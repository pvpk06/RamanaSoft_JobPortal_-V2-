import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './general.css';
import Notification from '../Create/notification';
import apiService from '../../../../../../../apiService';

const QuizOptionsForm = ({ token }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const [quizOptions, setQuizOptions] = useState({
        timeLimit: '',
        scheduleQuizFrom: '',
        scheduleQuizTo: '',
        qns_per_page: '',
        randomizeQuestions: false,
        confirmBeforeSubmission: false,
        showResultsAfterSubmission: false,
        showAnswersAfterSubmission: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizOptions = async () => {
            try {
                const response = await apiService.get(`/quiz-options/${token}`);
                console.log('Fetched quiz options:', response.data); 
                
                if (response.data) {
                    const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                    };

                    setQuizOptions({
                        ...response.data,
                        scheduleQuizFrom: formatDate(response.data.scheduleQuizFrom),
                        scheduleQuizTo: formatDate(response.data.scheduleQuizTo),
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching quiz options:', err);
                setError('Error fetching quiz options');
                setLoading(false);
            }
        };

        fetchQuizOptions();
    }, [token]);
    const closeNotification = () => {
        setNotification({ message: '', type: '' });
      };
    const handleQuizOptionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuizOptions({
            ...quizOptions,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiService.post('/quiz-options', {
                token,
                ...quizOptions,
            });
            console.log('Quiz options saved successfully:', response.data);
            setNotification({ message: 'Quiz options saved successfully', type: 'success' });

        } catch (error) {
            console.error('Error saving quiz options:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='General_quiz-options-container'>
                  <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
            <form className="General_quiz-options-form" onSubmit={handleSubmit}>
                <div className="General_form-group">
                    <label>
                        Time Limit (minutes):
                        <input
                            type="number"
                            min="1"
                            name="timeLimit"
                            value={quizOptions.timeLimit}
                            onChange={handleQuizOptionChange}
                        />
                    </label>
                </div>
                <div className="General_form-group">
                    <label>
                        Schedule Quiz:
                        <p> Start Date: </p>
                        <input
                            type="datetime-local"
                            name="scheduleQuizFrom"
                            value={quizOptions.scheduleQuizFrom}
                            onChange={handleQuizOptionChange}
                        />
                        <p>End Date: </p>
                        <input
                            type="datetime-local"
                            name="scheduleQuizTo"
                            value={quizOptions.scheduleQuizTo}
                            onChange={handleQuizOptionChange}
                        />
                    </label>
                </div>
                <div className="General_form-group">
                    <label>
                        No of Questions per page:
                        <input
                            type="number"
                            min="1"
                            name="qns_per_page"
                            value={quizOptions.qns_per_page}
                            onChange={handleQuizOptionChange}
                        />
                    </label>
                </div>
                <div className="General_form-group General_checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="randomizeQuestions"
                            checked={quizOptions.randomizeQuestions}
                            onChange={handleQuizOptionChange}
                        />
                        Randomize Questions
                    </label>
                </div>
                <div className="General_form-group General_checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="confirmBeforeSubmission"
                            checked={quizOptions.confirmBeforeSubmission}
                            onChange={handleQuizOptionChange}
                        />
                        Confirm Before Submission
                    </label>
                </div>
                <div className="General_form-group General_checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="showResultsAfterSubmission"
                            checked={quizOptions.showResultsAfterSubmission}
                            onChange={handleQuizOptionChange}
                        />
                        Show Results After Submission
                    </label>
                </div>
                <div className="General_form-group General_checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="showAnswersAfterSubmission"
                            checked={quizOptions.showAnswersAfterSubmission}
                            onChange={handleQuizOptionChange}
                        />
                        Show Answers After Submission
                    </label>
                </div>
                <div className="General_submit-button-container">
                    <button className='General_submit-button' type="submit">Save Options</button>
                </div>
            </form>
        </div>
    );
};

export default QuizOptionsForm;
