import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConnection';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './tasks.css'; 

function Tasks() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskId, setTaskId] = useState(null); 
  const [taskList, setTaskList] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    const unsubscribeTasks = onSnapshot(
      query(collection(db, 'tasks'), where('userEmail', '==', userEmail)),
      (snapshot) => {
        let tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
          });
        });
        setTaskList(tasks);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeTasks();
    };
  }, [userEmail]);

  async function addTask() {
    if (taskTitle && taskDescription) {
      try {
        if (taskId) {
          await updateDoc(doc(db, 'tasks', taskId), {
            title: taskTitle,
            description: taskDescription,
          });
          setTaskId(null); 
        } else {
          await addDoc(collection(db, 'tasks'), {
            title: taskTitle,
            description: taskDescription,
            userEmail: userEmail 
          });
        }

        setTaskTitle('');
        setTaskDescription('');
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Forneça um título e uma descrição.');
    }
  }

  async function deleteTask(id) {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.log(error);
    }
  }

  function editTask(task) {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskId(task.id); 
  }

  async function logoutUser() {
    await signOut(auth);
    navigate('/');
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Gerenciador de tarefas</h1>
        <div className="tasks-header-info">
          <span className="tasks-email">{userEmail}</span>
          <button className="tasks-logout" onClick={logoutUser}>Logout</button>
        </div>
      </div>
      <div className="tasks-form">
        <input
          type="text"
          className="tasks-input"
          placeholder="Título da tarefa"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <textarea
          className="tasks-textarea"
          placeholder="Descrição da tarefa"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <button className="tasks-button" onClick={addTask}>
          {taskId ? 'Atualizar tarefa' : 'Adicionar tarefa'}
        </button>

        <ul className="tasks-list">
          {taskList.map((task) => (
            <li key={task.id} className="tasks-item">
              <h3 className="tasks-item-title">{task.title}</h3>
              <p className="tasks-item-description">{task.description}</p>
              <button className="tasks-button tasks-edit-button" onClick={() => editTask(task)}>Editar</button>
              <button className="tasks-button tasks-delete-button" onClick={() => deleteTask(task.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;
