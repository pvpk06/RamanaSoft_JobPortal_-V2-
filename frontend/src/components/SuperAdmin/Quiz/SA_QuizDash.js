import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sa_quizAsh.css'; // Import the CSS file
import apiService from '../../../apiService';

const SAQuizDash = () => {

    const [folders, setFolders] = useState({});
    const [selectedSubfolder, setSelectedSubfolder] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await apiService.get('/getAllData');
            const organizedData = organizeData(response.data); // Use response.data directly
            setFolders(organizedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        }
    };
    

    const organizeData = (data) => {
        const organized = {};
        data.forEach(item => {
            if (!organized[item.folder_name]) {
                organized[item.folder_name] = { subfolders: [] };
            }
            if (item.subfolder_name) {
                const subfolderIndex = organized[item.folder_name].subfolders.findIndex(sf => sf.name === item.subfolder_name);
                if (subfolderIndex === -1) {
                    organized[item.folder_name].subfolders.push({
                        name: item.subfolder_name,
                        quizzes: item.quiz_name ? [{ name: item.quiz_name, type: item.quiz_type, token: item.token }] : []
                    });
                } else {
                    if (item.quiz_name) {
                        organized[item.folder_name].subfolders[subfolderIndex].quizzes.push({ name: item.quiz_name, type: item.quiz_type, token: item.token });
                    }
                }
            }
        });
        return organized;
    };

    const handleSubfolderClick = (folder, subfolder) => {
        setSelectedSubfolder({ folder, subfolder });
    };

    const handleQuizClick = (quizToken) => {
        navigate(`analysis/${quizToken}`);
    };

    return (
        <div className="SA_quiz-dash-container">
            <div className="SA_folder-list">
                <ul className="SA_folder-list-items">
                    {Object.keys(folders).map((folder, index) => (
                        <li key={index} className="SA_folder-item">
                            <div className="SA_folder-title">
                                {folder}
                            </div>
                            <ul className="SA_subfolder-list">
                                {folders[folder].subfolders.map((subfolder, subIndex) => (
                                    <li key={subIndex} className="SA_subfolder-item">
                                        <div
                                            className="SA_subfolder-title"
                                            onClick={() => handleSubfolderClick(folder, subfolder.name)}
                                        >
                                            {subfolder.name}
                                        </div>
                                        {selectedSubfolder?.folder === folder && selectedSubfolder?.subfolder === subfolder.name && (
                                            <ul className="SA_quiz-list">
                                                {subfolder.quizzes.map((quiz, qIndex) => (
                                                    <li key={qIndex} className="SA_quiz-item">
                                                        <div className="SA_quiz-name" onClick={() => handleQuizClick(quiz.token)}>
                                                            {quiz.name} ({quiz.type})
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            {error && <div className="SA_error-message">{error}</div>}
        </div>
    );
};

export default SAQuizDash;
