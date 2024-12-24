import React, {useEffect, useState} from "react";
import {Card} from "antd";
import axios from "axios";
import "../styles.css";
import api from "../api";
import CountdownTimer from "./Timer";
import Clock from "./Clock";

const Dashboard = () => {
    const [shift, setShift] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        const fetchShift = async () => {
            try {
                const response = await api.get("shift/current/");
                setShift(response.data);
            } catch (error) {
                console.error("Error fetching shift/current", error);
            }
        }
        fetchShift()
    }, [])


    if (!shift) {
        return <Card>No active shift.</Card>;
    }

    const currentTime = new Date();

    return (
        <div className="container">
            <div className="row row-1">
                <div className="col-25">
                    <Clock/>
                </div>
                <div className="col-50 border">
                    <h1>{shift.name} ({shift.product.name}, {shift.volume.volume}л)</h1>
                </div>
                {shift.is_paused ? (
                    <div className="col-25 yellow"><h1>ПЕРЕРВА</h1></div>
                ) : (
                    <div className="col-25"></div>
                )}
            </div>
            <div className="row row-2 border">
                <h1>
                    <CountdownTimer initialSeconds={shift.remaining_time}/>
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
