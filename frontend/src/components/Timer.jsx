import React, { useEffect, useState } from 'react';
import api from "../api";

const CountdownTimer = ({ initialSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Уменьшаем таймер каждую секунду
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Отправка времени на сервер каждые 10 секунд
  useEffect(() => {
    const sendTimeToServer = async () => {
      try {
        if (timeLeft > 0) {
          console.log('Отправка времени на сервер:', timeLeft);
          await api.post('/shift/update_time/', { timeLeft });
        }
      } catch (error) {
        console.error('Ошибка при отправке времени на сервер:', error);
      }
    };

    const sendInterval = setInterval(() => {
      sendTimeToServer();
    }, 10000); // Отправляем запросы каждые 10 секунд

    return () => clearInterval(sendInterval);
  }, []); // Пустой массив зависимостей, чтобы отправка происходила только один раз

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <h1>{formatTime(timeLeft)}</h1>
      ) : (
        <h1>Время вышло!</h1>
      )}
    </div>
  );
};

export default CountdownTimer;
