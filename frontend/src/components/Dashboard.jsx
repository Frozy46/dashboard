import React, {useEffect, useState} from "react";
import {Card} from "antd";
import axios from "axios";
import "../styles.css";

const Dashboard = () => {
    const [shift, setShift] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        let interval;
        let localTimer;

        const fetchShift = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/shift/current/"
                );
                setShift(response.data);

                // Рассчитываем оставшееся время на основе данных с сервера
                if (response.data && response.data.timer_mode) {
                    const timeLeft =
                        new Date(response.data.start_time).getTime() +
                        response.data.countdown_time * 1000 -
                        new Date().getTime();
                    setRemainingTime(Math.max(0, timeLeft)); // Устанавливаем оставшееся время
                }
            } catch (error) {
                setShift(null);
                setRemainingTime(null);
            }
        };

        // Локальное обновление оставшегося времени
        const startLocalTimer = () => {
            if (localTimer) clearInterval(localTimer);
            localTimer = setInterval(() => {
                setRemainingTime((prevTime) => (prevTime ? Math.max(0, prevTime - 1000) : 0));
            }, 1000);
        };

        // Старт запроса к серверу и настройка локального таймера
        const setupInterval = () => {
            if (interval) clearInterval(interval);
            fetchShift(); // Первый запрос
            interval = setInterval(fetchShift, 3000); // Обновление данных каждые 15 секунд
            startLocalTimer(); // Локальное обновление каждую секунду
        };

        setupInterval();

        return () => {
            clearInterval(interval);
            clearInterval(localTimer);
        };
    }, []); // Эффект запускается один раз при монтировании

    if (!shift) {
        return <Card>No active shift.</Card>;
    }

    const formattedRemainingTime = remainingTime
        ? new Date(remainingTime).toISOString().substr(11, 8) // Формат HH:MM:SS
        : "00:00:00";

    const currentTime = new Date();

    return (
        <div className="container">
            <div className="row row-1">
                <div className="col-25">
                    <div><h1>{currentTime.toLocaleDateString()}</h1></div>
                    <div><h1>{currentTime.toLocaleTimeString()}</h1></div>
                </div>
                <div className="col-50 border">
                    <h1>{shift.name} ({shift.product_type}, {shift.package_type}л)</h1>
                </div>
                {shift.is_paused ? (
                    <div className="col-25 yellow"><h1>ПЕРЕРВА</h1></div>
                ) : (
                    <div className="col-25"></div>
                )}
            </div>
            <div className="row row-2 border">
                <h1>
                    {shift.is_paused
                        ? formattedRemainingTime // Показываем последнее значение таймера
                        : formattedRemainingTime}
                </h1>
            </div>
            <div className="row row-3">
                <div className="border"><h1>{shift.goal}</h1></div>
                <div><h1>{shift.current_result}</h1></div>
                <div className="border">
                    <h1>{Math.round((shift.current_result / shift.goal) * 100)}%</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
