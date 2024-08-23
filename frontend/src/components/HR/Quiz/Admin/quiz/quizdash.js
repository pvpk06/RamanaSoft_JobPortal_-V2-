import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import HrNavbar from '../../../HrNavbar/HrNavbar';
import apiService from '../../../../../apiService';
import './quizdash.css'
const QuizDash = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [folders, setFolders] = useState({});
    const [newFolder, setNewFolder] = useState('');
    const [newSubfolder, setNewSubfolder] = useState('');
    const [newQuiz, setNewQuiz] = useState('');
    const [quizType, setQuizType] = useState('');
    const [openFolders, setOpenFolders] = useState({});
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [showSubfolderInput, setShowSubfolderInput] = useState(null);
    const [selectedSubfolder, setSelectedSubfolder] = useState(null);
    const [showQuizInputs, setShowQuizInputs] = useState(false);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [renameQuiz, setRenameQuiz] = useState({ token: '', name: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const fetchData = async () => {
        try {
            const response = await apiService.get('/getAllData');
            const data = response.data;
            const organizedData = organizeData(data);
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

    const addFolder = async () => {
        if (newFolder.trim() !== '') {
            setFolders({ ...folders, [newFolder]: { subfolders: [] } });
            setNewFolder('');
            setShowFolderInput(false);
            try {
                await apiService.post('/addFolder', { folder: newFolder });
            } catch (error) {
                console.error('Error adding folder:', error);
                setError('Failed to add folder');
            }
        }
    };

    const addSubfolder = async (folder) => {
        if (newSubfolder.trim() !== '') {
            setFolders({
                ...folders,
                [folder]: {
                    ...folders[folder],
                    subfolders: [...folders[folder].subfolders, { name: newSubfolder, quizzes: [] }]
                }
            });
            setNewSubfolder('');
            setShowSubfolderInput(null);
            try {
                await apiService.post('/addSubfolder', { folder, subfolder: newSubfolder });
            } catch (error) {
                console.error('Error adding subfolder:', error);
                setError('Failed to add subfolder');
            }
        }
    };

    const handleAddQuizClick = () => {
        setShowQuizInputs(true);
    };

    const addQuiz = async (folder, subfolder) => {
        if (newQuiz.trim() !== '' && quizType !== '') {
            const token = uuidv4();
            const updatedSubfolders = folders[folder].subfolders.map((sf) => {
                if (sf.name === subfolder) {
                    return { ...sf, quizzes: [...sf.quizzes, { name: newQuiz, type: quizType, token }] };
                }
                return sf;
            });

            setFolders({
                ...folders,
                [folder]: {
                    ...folders[folder],
                    subfolders: updatedSubfolders
                }
            });
            setNewQuiz('');
            setQuizType('');
            setShowQuizInputs(false);
            try {
                await apiService.post('/addQuiz', { folder, subfolder, quiz: newQuiz, type: quizType, token });
            } catch (error) {
                console.error('Error adding quiz:', error);
                setError('Failed to add quiz');
            }
            navigate(`/edit/create/${token}`);
        }
    };

    const toggleFolder = (folder) => {
        setOpenFolders(prevState => ({ ...prevState, [folder]: !prevState[folder] }));
    };

    const handleSubfolderClick = (folder, subfolder) => {
        setSelectedSubfolder({ folder, subfolder });
    };

    const handlePreviewClick = (quizToken) => {
        const url = `/preview/${quizToken}`;
        window.open(url, '_blank');
    };

    const handleRenameQuiz = (quizToken) => {
        const quiz = folders[selectedSubfolder.folder].subfolders
            .find(sf => sf.name === selectedSubfolder.subfolder)
            .quizzes.find(q => q.token === quizToken);

        setRenameQuiz({ token: quizToken, name: quiz.name });
    };

    const handleRenameChange = (e) => {
        setRenameQuiz({ ...renameQuiz, name: e.target.value });
    };

    const handleRenameSubmit = async (e) => {
        e.preventDefault();
        const updatedSubfolders = folders[selectedSubfolder.folder].subfolders.map((sf) => {
            if (sf.name === selectedSubfolder.subfolder) {
                return {
                    ...sf,
                    quizzes: sf.quizzes.map((q) => (q.token === renameQuiz.token ? { ...q, name: renameQuiz.name } : q))
                };
            }
            return sf;
        });

        setFolders({
            ...folders,
            [selectedSubfolder.folder]: {
                ...folders[selectedSubfolder.folder],
                subfolders: updatedSubfolders
            }
        });

        setRenameQuiz({ token: '', name: '' });

        try {
            await apiService.put(`/renameQuiz/${renameQuiz.token}`, { token: renameQuiz.token, name: renameQuiz.name });
        } catch (error) {
            console.error('Error renaming quiz:', error);
            setError('Failed to rename quiz');
        }
    };

    const Modal = ({ message, onClose }) => {
        if (!message) return null;

        return (
            <div className="Q_modal-overlay" onClick={onClose}>
                <div className="Q_modal-content" onClick={(e) => e.stopPropagation()}>
                    <p>{message}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    const handleDeleteQuiz = async (quizToken) => {
        const updatedSubfolders = folders[selectedSubfolder.folder].subfolders.map((sf) => {
            if (sf.name === selectedSubfolder.subfolder) {
                return {
                    ...sf,
                    quizzes: sf.quizzes.filter((q) => q.token !== quizToken)
                };
            }
            return sf;
        });

        setFolders({
            ...folders,
            [selectedSubfolder.folder]: {
                ...folders[selectedSubfolder.folder],
                subfolders: updatedSubfolders
            }
        });

        try {
            await apiService.delete(`/deleteQuiz/${quizToken}`);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            setError('Failed to delete quiz');
        }
    };

    const handleDropdownSelect = (option, quizToken) => {
        switch (option) {
            case 'rename':
                handleRenameQuiz(quizToken);
                break;
            case 'delete':
                handleDeleteQuiz(quizToken);
                break;
            default:
                break;
        }
        setDropdownOpen(null);
    };

    return (
        <>
            <HrNavbar />
            <div className="Q_Quiz_content" style={{height:"700px"}}>
                <div className="Q_quiz-container">
                    <div className={`Q_left-panel ${isPanelOpen ? 'open' : 'closed'}`}>
                        <ul className="Q_folder-list" style={{marginTop:"30px"}}>
                            {Object.keys(folders).map((folder, index) => (
                                <li key={index} className="Q_folder-item">
                                    <div className="Q_folder-header" onClick={() => toggleFolder(folder)}>
                                        {folder}
                                        <FontAwesomeIcon icon={openFolders[folder] ? faChevronDown : faPlus} className="Q_toggle-icon" />
                                    </div>
                                    {openFolders[folder] && (
                                        <ul className="Q_subfolder-list">
                                            {folders[folder].subfolders.map((subfolder, subIndex) => (
                                                <li key={subIndex} className="Q_subfolder-item">
                                                    <div className="Q_subfolder-header" onClick={() => handleSubfolderClick(folder, subfolder.name)}>
                                                        {subfolder.name}
                                                    </div>
                                                </li>
                                            ))}
                                            {showSubfolderInput === folder ? (
                                                <div className="Q_input-container1">
                                                    <input
                                                        type="text"
                                                        className="Q_subfolder-input"
                                                        value={newSubfolder}
                                                        onChange={(e) => setNewSubfolder(e.target.value)}
                                                        placeholder="New subfolder name"
                                                    />
                                                    <button className="Q_add-subfolder-button" onClick={() => addSubfolder(folder)}>
                                                        Add
                                                    </button>
                                                    <button className="Q_cancel-button" onClick={() => setShowSubfolderInput(null)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="Q_add-subfolder-icon" onClick={() => setShowSubfolderInput(folder)}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            )}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="Q_input-container1">
                            {showFolderInput ? (
                                <>
                                    <input
                                        type="text"
                                        className="Q_folder-input"
                                        value={newFolder}
                                        onChange={(e) => setNewFolder(e.target.value)}
                                        placeholder="New folder name"
                                    />
                                    <button className="Q_add-folder-button" onClick={addFolder}>
                                        Add
                                    </button>
                                    <button className="Q_cancel-button" onClick={() => {
                                        console.log("Button clicked"); setShowFolderInput(false);
                                    }}>

                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </>
                            ) : (
                                <button className="Q_add-folder-icon" onClick={() => setShowFolderInput(true)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="Q_right-panel">
                        {selectedSubfolder ? (
                            <div className="Q_content-display">
                                <h3>{selectedSubfolder.folder}/{selectedSubfolder.subfolder}</h3>
                                <div className="Q_input-container">
                                    {showQuizInputs ? (
                                        <>
                                            <select className="Q_quiz-type-select" value={quizType} onChange={(e) => setQuizType(e.target.value)}>
                                                <option className='Q_QuizOption' value="">Quiz Type</option>
                                                <option className='Q_QuizOption' value="live">Live</option>
                                                <option className='Q_QuizOption' value="static">Static</option>
                                            </select>
                                            {quizType && (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="Q_quiz-input"
                                                        value={newQuiz}
                                                        onChange={(e) => setNewQuiz(e.target.value)}
                                                        placeholder="New quiz name"
                                                    />
                                                    <button className="Q_add-quiz-button" onClick={() => addQuiz(selectedSubfolder.folder, selectedSubfolder.subfolder)}>
                                                        Add
                                                    </button>
                                                    <button className="Q_cancel-button" onClick={() => setShowQuizInputs(false)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <button onClick={handleAddQuizClick}>
                                            New Quiz
                                        </button>
                                    )}
                                </div>
                                <table className="Q_quiz-table">
                                    <tbody className='Q_Quiz_Table_Body'>
                                        {folders[selectedSubfolder.folder].subfolders
                                            .find(sf => sf.name === selectedSubfolder.subfolder)
                                            .quizzes.map((quiz, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {renameQuiz.token === quiz.token ? (
                                                            <form onSubmit={handleRenameSubmit}>
                                                                <input
                                                                    type="text"
                                                                    value={renameQuiz.name}
                                                                    onChange={handleRenameChange}
                                                                    onBlur={() => setRenameQuiz({ token: '', name: '' })}
                                                                    autoFocus
                                                                />
                                                            </form>
                                                        ) : (
                                                            <Link className='Q_quiz-link' to={`/edit/create/${quiz.token}`} >
                                                                {quiz.name}
                                                            </Link>
                                                        )}
                                                    </td>
                                                    <td className='Q_table-set-2'>{quiz.type}</td>
                                                    <td>{quiz.status}</td>
                                                    <td className='Q_buttonTd'>
                                                        <button className='Q_button' onClick={() => handlePreviewClick(quiz.token)}>
                                                            Preview
                                                        </button>
                                                        <div className="Q_options-dropdown-container">
                                                            <button
                                                                className='Q_button'
                                                                onClick={() => setDropdownOpen(dropdownOpen === quiz.token ? null : quiz.token)}
                                                            >
                                                                Options
                                                            </button>
                                                            {dropdownOpen === quiz.token && (
                                                                <div className="Q_options-dropdown">
                                                                    <button onClick={() => handleDropdownSelect('rename', quiz.token)}>Rename</button>
                                                                    <button onClick={() => handleDropdownSelect('delete', quiz.token)}>Delete</button>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="Q_content-display">

                            </div>

                        )}
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </>

    );
};

export default QuizDash;
