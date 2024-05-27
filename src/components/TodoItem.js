import React, { useState, useEffect } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onDelete, onEdit, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const deadline = new Date(todo.deadline);
      const total = deadline - todo.createdAt;
      const remaining = deadline - now;
      const percentage = ((total - remaining) / total) * 100;
      setProgress(percentage);

      if (remaining < 0) {
        setTimeLeft('Deadline passed');
      } else if (remaining < 3600000) { // less than 1 hour
        setTimeLeft('Less than an hour remaining');
      } else if (remaining < 86400000) { // less than 1 day
        setTimeLeft('Less than a day remaining');
      } else {
        setTimeLeft(`${Math.ceil(remaining / 86400000)} days remaining`);
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // update every minute
    return () => clearInterval(interval);
  }, [todo]);

  const handleEdit = () => {
    onEdit(todo.id, newText);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
        />
      ) : (
        <span onClick={() => setIsEditing(true)}>{todo.text}</span>
      )}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
      <div className="deadline-info">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <span>{timeLeft}</span>
      </div>
    </div>
  );
}

export default TodoItem;
