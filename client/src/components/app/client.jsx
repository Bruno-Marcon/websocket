import React, { useState, useEffect } from 'react';
import styles from './MessageForm.module.css';

function Client() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
  
    const ws = new WebSocket('ws://localhost:8765');
    ws.onopen = function(event) {
      console.log('Conexão estabelecida');
      setSocket(ws); 
    };

    ws.onmessage = function(event) {
      const message = event.data;
      setResponse(message);
    };

    ws.onerror = function(error) {
      console.error('Erro na conexão WebSocket:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error('Erro ao enviar mensagem: conexão WebSocket não está aberta');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mensagem</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>

          <input
            type="text"
            value={message}
            onChange={handleChange}
            className={styles.inputText}
          />
        </label>
        <button type="submit" className={styles.submitButton}>Enviar</button>
      </form>
      {response && <p className={styles.response}>Resposta do servidor: {response}</p>}
    </div>
  );
}

export default Client;
