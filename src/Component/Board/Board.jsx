import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "./Board.css"
import { Link, useLocation } from 'react-router-dom';

const Board = () => {
    const [bgImage, setBgImage] = useState(false);
    // Titles Columns
    const [titleFirstColumn, setTitleFirstColumn] = useState('');
    const [titleSecondColumn, setTitleSecondColumn] = useState('');
    const [titleThirdColumn, setTitleThirdColumn] = useState('');
    const [titleFourthColumn, setTitleFourthColumn] = useState('');
    const [columnsCount, setColumnsCount] = useState(null);
    // Add Task For Each Column
    // First
    const [showModalFirst, setShowModalFirst] = useState(false);
    const [titleTasksFirst, setTitleTasksFirst] = useState("");
    const [descriptionTasksFirst, setDescriptionTasksFirst] = useState("");
    const [tasksFirstColumn, setTasksFirstColumn] = useState([]);
    // Second
    const [showModalSecond, setShowModalSecond] = useState(false);
    const [titleTasksSecond, setTitleTasksSecond] = useState("");
    const [descriptionTasksSecond, setDescriptionTasksSecond] = useState("");
    const [tasksSecondColumn, setTasksSecondColumn] = useState([]);
    // Third
    const [showModalThird, setShowModalThird] = useState(false);
    const [titleTasksThird, setTitleTasksThird] = useState("");
    const [descriptionTasksThird, setDescriptionTasksThird] = useState("");
    const [tasksThirdColumn, setTasksThirdColumn] = useState([]);
    // Fourth
    const [showModalFourth, setShowModalFourth] = useState(false);
    const [titleTasksFourth, setTitleTasksFourth] = useState("");
    const [descriptionTasksFourth, setDescriptionTasksFourth] = useState("");
    const [tasksFourthColumn, setTasksFourthColumn] = useState([]);
    // Change Column Title
    const [showChangeModalFirst, setShowChangeModalFirst] = useState(false);
    const [newFirstColumnTitle, setNewFirstColumnTitle] = useState("");
    const [showChangeModalSecond, setShowChangeModalSecond] = useState(false);
    const [newSecondColumnTitle, setNewSecondColumnTitle] = useState("");
    const [showChangeModalThird, setShowChangeModalThird] = useState(false);
    const [newThirdColumnTitle, setNewThirdColumnTitle] = useState("");
    const [showChangeModalFourth, setShowChangeModalFourth] = useState(false);
    const [newFourthColumnTitle, setNewFourthColumnTitle] = useState("");

    const handleChangeTheme = () => {
        setBgImage(!bgImage);
    };

    // Initialize Firestore
    firebase.initializeApp({
        apiKey: "AIzaSyCDZ4RhqDZH-bNwIw9mtRx-EqfjjUFnnS0",
        authDomain: "kanban-board-8a292.firebaseapp.com",
        projectId: "kanban-board-8a292",
        storageBucket: "kanban-board-8a292.appspot.com",
        messagingSenderId: "820080090059",
        appId: "1:820080090059:web:3a10079efaf5e4cbf2b44e"
    });
    // Getting User ID 
    const location = useLocation();
    const userId = location.state.userId;
    const db = firebase.firestore();

    useEffect(() => {
        const db = firebase.firestore();
        const colectionRef = db.collection("users").doc(userId)
        .onSnapshot((doc) => {
        const data = doc.data();
        setColumnsCount(data.columnCount);
    });
    return colectionRef;
    }, [userId]);

    // Handle For Column 1
    const handleSubmitFirstColumn = (event) => {
        const addColumn = (title) => {
                db.collection("users").doc(userId)
                    .update({
                        [`board_1`]: { title: title, tasks: [] },
                    })
        };
        event.preventDefault();
        const title = event.target.elements.title.value;
        addColumn(title);
        setTitleFirstColumn(title);
        db.collection("users").doc(userId).update({
            columnCount: 2,
        })
    }
    // Getting Title of First Board
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
        const data = doc.data();
        if (data && data.board_1) {
            setTitleFirstColumn(data.board_1.title);
        }
        });
        return unsubscribe;
    }, [userId]);
    // Add Task First Column
    const handleAddTaskFirst = async (event) => {
        event.preventDefault();
        db.collection("users").doc(userId).get()
            .then((doc) => {
            const board = doc.data().board_1;
            const tasks = board.tasks;
                const newTask = {
                taskTitle: titleTasksFirst,
                taskDescription: descriptionTasksFirst,
            };
            db.collection("users").doc(userId)
                .update({
                    board_1: {
                        ...board,
                        tasks: [...tasks, newTask],
                    },
                })
                .then(() => {
                    setShowModalFirst(false);
                    setTitleTasksFirst("");
                    setDescriptionTasksFirst("");
                })
            });
    };
    // Update Tasks
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
            setTasksFirstColumn(doc.data().board_1.tasks);
        });
        return () => {unsubscribe();};
    }, [userId]);
    // Delete Task First
    const handleDeleteTaskFirst = (taskTitle) => {
        // Create a new array in which there will be no task with specified Tasktitle
        const updatedTasks = tasksFirstColumn.filter((task) => task.taskTitle !== taskTitle);
        // Updating an array in a document with a user
        db.collection("users").doc(userId).update({
            board_1: {title:titleFirstColumn,tasks: updatedTasks,},
        })
    };
    // Delete Column 1
    const deleteColumnFirst = async () => {
    try {
        await db.collection("users").doc(userId).update({
        board_1: firebase.firestore.FieldValue.delete(),
        });
        setColumnsCount(1);
        db.collection("users").doc(userId).update({
            columnCount: 1,
        });
    } catch (error) {
        console.error("Error deleting column", error);
    }
    };
    // Change Column Title
    const handleChangeColumnTitleFirst = (e) => {
        e.preventDefault();
        db.collection("users")
            .doc(userId)
            .update({
                board_1: {
                    title: newFirstColumnTitle,
                    tasks: tasksFirstColumn,
                },
            })
            .then(() => {
                setShowChangeModalFirst(false);    
            })
    };


    // Handle For Column 2
    const handleSubmitSecondColumn = (event) => {
        const addColumn = (title) => {
                db.collection("users").doc(userId)
                    .update({
                        [`board_2`]: { title: title, tasks: [] },
                    })
        };
        event.preventDefault();
        const title = event.target.elements.title.value;
        addColumn(title);
        setTitleSecondColumn(title);
        db.collection("users").doc(userId).update({
            columnCount: 3,
        })
    }
    // Getting Title of Second Board
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
        const data = doc.data();
        if (data && data.board_2) {
            setTitleSecondColumn(data.board_2.title);
        }
        });
        return unsubscribe;
    }, [userId]);
    // Add Task Second Column
    const handleAddTaskSecond = async (event) => {
        event.preventDefault();
        db.collection("users").doc(userId).get()
            .then((doc) => {
            const board = doc.data().board_2;
            const tasks = board.tasks;
            const newTask = {
                taskTitle: titleTasksSecond,
                taskDescription: descriptionTasksSecond,
            };
            db.collection("users").doc(userId).update({
                    board_2: {
                        ...board,
                        tasks: [...tasks, newTask],
                    },
                })
                .then(() => {
                    setShowModalSecond(false);
                    setTitleTasksSecond("");
                    setDescriptionTasksSecond("");
                })
            });
    };
    // Update Tasks
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
            setTasksSecondColumn(doc.data().board_2.tasks);
        });
        return () => {unsubscribe();};
    }, [userId]);
    // Delete Task Second
    const handleDeleteTaskSecond = (taskTitle) => {
        // Create a new array in which there will be no task with specified Tasktitle
        const updatedTasks = tasksSecondColumn.filter((task) => task.taskTitle !== taskTitle);
        // Updating an array in a document with a user
        db.collection("users").doc(userId).update({
            board_2: {title:titleSecondColumn,tasks: updatedTasks,},
        })
    };
    // Delete Column 2
    const deleteColumnSecond = async () => {
    try {
        await db.collection("users").doc(userId).update({
        board_2: firebase.firestore.FieldValue.delete(),
        });
        setColumnsCount(2);
        db.collection("users").doc(userId).update({
            columnCount: 2,
        });
    } catch (error) {
        console.error("Error deleting column", error);
    }
    };
    // Change Column Title
    const handleChangeColumnTitleSecond = (e) => {
        e.preventDefault();
        db.collection("users")
            .doc(userId)
            .update({
                board_2: {
                    title: newSecondColumnTitle,
                    tasks: tasksSecondColumn,
                },
            })
            .then(() => {
                setShowChangeModalSecond(false);    
            })
    };



    // Handle For Column 3
    const handleSubmitThirdColumn = (event) => {
        const addColumn = (title) => {
                db.collection("users").doc(userId)
                    .update({
                        [`board_3`]: { title: title, tasks: [] },
                    })
        };
        event.preventDefault();
        const title = event.target.elements.title.value;
        addColumn(title);
        setTitleThirdColumn(title);
        db.collection("users").doc(userId).update({
            columnCount: 4,
        })
    }
    // Getting Title of Third Board
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
        const data = doc.data();
        if (data && data.board_3) {
            setTitleThirdColumn(data.board_3.title);
        }
        });
        return unsubscribe;
    }, [userId]);
    // Add Task Third Column
    const handleAddTaskThird = async (event) => {
        event.preventDefault();
        db.collection("users").doc(userId).get().then((doc) => {
            const board = doc.data().board_3;
            const tasks = board.tasks;
            const newTask = {
                taskTitle: titleTasksThird,
                taskDescription: descriptionTasksThird,
            };
            db.collection("users").doc(userId)
                .update({
                    board_3: {
                        ...board,
                        tasks: [...tasks, newTask],
                    },
                })
                .then(() => {
                    setShowModalThird(false);
                    setTitleTasksThird("");
                    setDescriptionTasksThird("");
                })
            });
    };
    // Update Tasks
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
            setTasksThirdColumn(doc.data().board_3.tasks);
        });
        return () => { unsubscribe(); };
    }, [userId]);
    // Delete Task Third
    const handleDeleteTaskThird= (taskTitle) => {
        // Create a new array in which there will be no task with specified Tasktitle
        const updatedTasks = tasksThirdColumn.filter((task) => task.taskTitle !== taskTitle);
        // Updating an array in a document with a user
        db.collection("users").doc(userId).update({
            board_3: {title:titleThirdColumn,tasks: updatedTasks,},
        })
    };
    // Delete Column 3
    const deleteColumnThird = async () => {
    try {
        await db.collection("users").doc(userId).update({
        board_3: firebase.firestore.FieldValue.delete(),
        });
        setColumnsCount(3);
        db.collection("users").doc(userId).update({
            columnCount: 3,
        });
    } catch (error) {
        console.error("Error deleting column", error);
    }
    };
    // Change Column Title
    const handleChangeColumnTitleThird = (e) => {
        e.preventDefault();
        db.collection("users")
            .doc(userId)
            .update({
                board_3: {
                    title: newThirdColumnTitle,
                    tasks: tasksThirdColumn,
                },
            })
            .then(() => {
                setShowChangeModalThird(false);    
            })
    };



    // Handle For Column 4
    const handleSubmitFourthColumn = (event) => {
        const addColumn = (title) => {
                db.collection("users").doc(userId)
                    .update({
                        [`board_4`]: { title: title, tasks: [] },
                    })
        };
        event.preventDefault();
        const title = event.target.elements.title.value;
        addColumn(title);
        setTitleFourthColumn(title);
        db.collection("users").doc(userId).update({
            columnCount: 5,
        })
    }
    // Getting Title of Fourth Board
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
        const data = doc.data();
        if (data && data.board_4) {
            setTitleFourthColumn(data.board_4.title);
        }
        });
        return unsubscribe;
    }, [userId]);
    // Add Task Fourth Column
    const handleAddTaskFourth = async (event) => {
        event.preventDefault();
        db.collection("users").doc(userId).get().then((doc) => {
            const board = doc.data().board_4;
            const tasks = board.tasks;
            const newTask = {
                taskTitle: titleTasksFourth,
                taskDescription: descriptionTasksFourth,
            };
            db.collection("users").doc(userId).update({
                    board_4: {
                        ...board,
                        tasks: [...tasks, newTask],
                    },
                })
                .then(() => {
                    setShowModalFourth(false);
                    setTitleTasksFourth("");
                    setDescriptionTasksFourth("");
                })
            });
    };
    // Update Tasks
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
            setTasksFourthColumn(doc.data().board_4.tasks);
        });
        return () => { unsubscribe(); };
    }, [userId]);
    // Delete Task Fourth
    const handleDeleteTaskFourth = (taskTitle) => {
        // Create a new array in which there will be no task with specified Tasktitle
        const updatedTasks = tasksFourthColumn.filter((task) => task.taskTitle !== taskTitle);
        // Updating an array in a document with a user
        db.collection("users").doc(userId).update({
            board_4: {title:titleFourthColumn,tasks: updatedTasks,},
        })
    };
    // Delete Column 4
    const deleteColumnFourth = async () => {
    try {
        await db.collection("users").doc(userId).update({
        board_4: firebase.firestore.FieldValue.delete(),
        });
        setColumnsCount(4);
        db.collection("users").doc(userId).update({
            columnCount: 4,
        });
    } catch (error) {
        console.error("Error deleting column", error);
    }
    };
    // Change Column Title
    const handleChangeColumnTitleFourth = (e) => {
        e.preventDefault();
        db.collection("users")
            .doc(userId)
            .update({
                board_5: {
                    title: newFourthColumnTitle,
                    tasks: tasksFourthColumn,
                },
            })
            .then(() => {
                setShowChangeModalFourth(false);    
            })
    };



    return (
        <div className={bgImage ? ("wrapper light-mode") : ("wrapper dark-mode")}>
        <div className="main-title">
            <Link to="/" className='main-title__link'>
                <img src="https://cdn-icons-png.flaticon.com/512/9177/9177875.png" alt="" /><span>Your Kanban Board</span>
            </Link>
            <button className='main-title__change-bg-btn' onClick={handleChangeTheme}>
                {bgImage ? (<img src="https://cdn-icons-png.flaticon.com/512/3917/3917817.png" alt="" />)
                : (<img src="https://cdn-icons-png.flaticon.com/512/3982/3982196.png" alt="" />)}
            </button>
        </div>
            <div className="container board-container">
                {columnsCount === 1 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <form className="add-column" onSubmit={handleSubmitFirstColumn}>
                                <button type='submit' className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                <input maxLength={16} type="text" className='add-input' name='title' placeholder="Enter column name"/>
                            </form>
                        </div>
                    </div>
                )}
                {columnsCount === 2 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleFirstColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalFirst(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                    <button className='column__delete-btn' onClick={deleteColumnFirst}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalFirst(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalFirst && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleFirst}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newFirstColumnTitle} onChange={(e) => setNewFirstColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalFirst(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                                {showModalFirst && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskFirst} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksFirst} onChange={(event) => setTitleTasksFirst(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksFirst} onChange={(event) => setDescriptionTasksFirst(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalFirst(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksFirstColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskFirst(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 2 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <form className="add-column" onSubmit={handleSubmitSecondColumn}>
                                <button type='submit' className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                <input maxLength={16} type="text" className='add-input' name='title' placeholder="Enter column name"/>
                            </form>
                        </div>
                    </div> 
                )}
                {columnsCount === 3 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleFirstColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalFirst(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalFirst(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalFirst && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleFirst}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newFirstColumnTitle} onChange={(e) => setNewFirstColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalFirst(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalFirst && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskFirst} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksFirst} onChange={(event) => setTitleTasksFirst(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksFirst} onChange={(event) => setDescriptionTasksFirst(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalFirst(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksFirstColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskFirst(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 3 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleSecondColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalSecond(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                    <button className='column__delete-btn' onClick={deleteColumnSecond}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalSecond(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalSecond && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleSecond}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newSecondColumnTitle} onChange={(e) => setNewSecondColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalSecond(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalSecond && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskSecond} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksSecond} onChange={(event) => setTitleTasksSecond(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksSecond} onChange={(event) => setDescriptionTasksSecond(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalSecond(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksSecondColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__title">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskSecond(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 3 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <form className="add-column" onSubmit={handleSubmitThirdColumn}>
                                <button type='submit' className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                <input maxLength={16} type="text" className='add-input' name='title' placeholder="Enter column name"/>
                            </form>
                        </div>
                    </div>
                )}
                {columnsCount === 4 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleFirstColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalFirst(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalFirst(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalFirst && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleFirst}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newFirstColumnTitle} onChange={(e) => setNewFirstColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalFirst(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalFirst && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskSecond} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksFirst} onChange={(event) => setTitleTasksFirst(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksFirst} onChange={(event) => setDescriptionTasksFirst(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalFirst(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksFirstColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskFirst(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 4 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleSecondColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalSecond(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalSecond(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalSecond && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleSecond}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newSecondColumnTitle} onChange={(e) => setNewSecondColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalSecond(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalSecond && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskSecond} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksSecond} onChange={(event) => setTitleTasksSecond(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksSecond} onChange={(event) => setDescriptionTasksSecond(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalSecond(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksSecondColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskSecond(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 4 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleThirdColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalThird(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                    <button className='column__delete-btn' onClick={deleteColumnThird}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalThird(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalThird && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleThird}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newThirdColumnTitle} onChange={(e) => setNewThirdColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalThird(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalThird && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskThird} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksThird} onChange={(event) => setTitleTasksThird(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksThird} onChange={(event) => setDescriptionTasksThird(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalThird(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksThirdColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskThird(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 4 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <form className="add-column" onSubmit={handleSubmitFourthColumn}>
                                <button type='submit' className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                <input maxLength={16} type="text" className='add-input' name='title' placeholder="Enter column name"/>
                            </form>
                        </div>
                    </div>
                )}
                {columnsCount === 5 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleFirstColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalFirst(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalFirst(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalFirst && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleFirst}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newFirstColumnTitle} onChange={(e) => setNewFirstColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalFirst(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                                {showModalFirst && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskFirst} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksFirst} onChange={(event) => setTitleTasksFirst(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksFirst} onChange={(event) => setDescriptionTasksFirst(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalFirst(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksFirstColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskFirst(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 5 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleSecondColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalSecond(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalSecond(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalSecond && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleSecond}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newSecondColumnTitle} onChange={(e) => setNewSecondColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalSecond(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalSecond && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskSecond} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksSecond} onChange={(event) => setTitleTasksSecond(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksSecond} onChange={(event) => setDescriptionTasksSecond(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalSecond(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksSecondColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskSecond(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 5 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleThirdColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalThird(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalThird(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalThird && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleThird}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newThirdColumnTitle} onChange={(e) => setNewThirdColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalThird(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalThird && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskThird} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksThird} onChange={(event) => setTitleTasksThird(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksThird} onChange={(event) => setDescriptionTasksThird(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalThird(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksThirdColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskThird(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {columnsCount === 5 && (
                    <div className="board-column column">
                        <div className="column__body">
                            <div className="column__tasks">
                                <h4 className='column__title'>{titleFourthColumn}</h4>
                                <div className="column__buttons">
                                    <button className='column__delete-btn' onClick={() => setShowChangeModalFourth(true)}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/3329/3329465.png" alt="" />
                                    </button>
                                    <button className='column__delete-btn' onClick={deleteColumnFourth}>
                                        <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                    </button>
                                </div>
                                <button onClick={() => setShowModalFourth(true)} className="column__add-btn">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2997/2997933.png" alt="" />
                                </button>
                                {showChangeModalFourth && (
                                    <div className='add-task-modal'>
                                        <form className="add-task-modal__form" onSubmit={handleChangeColumnTitleFourth}>
                                        <h4 className='add-task-modal__title'>Edit Column Name</h4>
                                        <input maxLength={16} type="text" value={newFourthColumnTitle} onChange={(e) => setNewFourthColumnTitle(e.target.value)} />
                                        <button className='add-task-modal__add-btn' type="submit">Change Column Name</button>
                                        <button className='add-task-modal__close-btn' onClick={() => setShowChangeModalFourth(false)}>
                                            <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                        </button>
                                        </form>
                                    </div>
                                )}
                            {showModalFourth && (
                                    <div className='add-task-modal'>
                                        <form onSubmit={handleAddTaskFourth} className="add-task-modal__form">
                                            <h4 className='add-task-modal__title'>Adding Task</h4>
                                            <input maxLength={16} type="text" placeholder="Task Title" value={titleTasksFourth} onChange={(event) => setTitleTasksFourth(event.target.value)}/>
                                            <input maxLength={16} type="text" placeholder="Task Description" value={descriptionTasksFourth} onChange={(event) => setDescriptionTasksFourth(event.target.value)}/>
                                            <button className='add-task-modal__add-btn' type="submit">Add Task</button>
                                            <button className='add-task-modal__close-btn' onClick={() => setShowModalFourth(false)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/747/747953.png" alt="" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ul className='tasks-list tasks'>
                                {tasksFourthColumn.map((task) => (
                                    <li key={task.taskTitle} className="tasks-item">
                                        <div className="tasks__content">
                                            <p className='tasks__subtitle'>Task Name</p>
                                            <h3 className='tasks__title'>{task.taskTitle}</h3>
                                            <p className='tasks__subtitle'>Task Description</p>
                                            <p className='tasks__description'>{task.taskDescription}</p>
                                        </div>
                                        <div className="tasks__buttons">
                                            <button className='tasks__delete-btn' onClick={() => handleDeleteTaskFourth(task.taskTitle)}>
                                                <img src="https://cdn-icons-png.flaticon.com/512/748/748122.png" alt="" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Board;
