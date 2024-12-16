// ShiftControl.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ActiveShiftCard from "./ActiveShiftCard";
import CreateShiftForm from "./CreateShiftForm";
import { Card } from "antd";

const ShiftControl = () => {
    const [activeShift, setActiveShift] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpenEnded, setIsOpenEnded] = useState(false);

    const fetchActiveShift = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/shift/current/");
            setActiveShift(response.data);
        } catch {
            setActiveShift(null);
        }
    };

    useEffect(() => {
        fetchActiveShift();
    }, []);

    const handlePauseResume = async () => {
        if (!activeShift) return;
        try {
            await axios.post(`http://127.0.0.1:8000/api/shift/${activeShift.id}/pause/`);
            fetchActiveShift();
        } catch (error) {
            console.error("Error pausing/resuming shift:", error);
        }
    };

    const handleEndShift = async () => {
        if (!activeShift) return;
        try {
            await axios.post(`/api/shift/${activeShift.id}/end/`);
            fetchActiveShift();
        } catch (error) {
            console.error("Error ending shift:", error);
        }
    };

    const handleCreateShift = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/shift/start/", values);
            setActiveShift(response.data);
        } catch (error) {
            console.error("Error creating shift:", error);
        } finally {
            setLoading(false);
        }
    };

    if (activeShift) {
        return (
            <ActiveShiftCard
                activeShift={activeShift}
                handlePauseResume={handlePauseResume}
                handleEndShift={handleEndShift}
            />
        );
    }

    return (
        <Card title="Створення нової зміни">
            <CreateShiftForm
                onFinish={handleCreateShift}
                loading={loading}
                isOpenEnded={isOpenEnded}
                setIsOpenEnded={setIsOpenEnded}
            />
        </Card>
    );
};

export default ShiftControl;
