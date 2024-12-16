import React from "react";
import { Card, Button } from "antd";

const ActiveShiftCard = ({ activeShift, handlePauseResume, handleEndShift }) => {
    return (
        <Card title="Manage Active Shift">
            <p>Shift Name: {activeShift.name}</p>
            <p>Goal: {activeShift.goal}</p>
            <p>Start Time: {new Date(activeShift.start_time).toLocaleString()}</p>
            <Button onClick={handlePauseResume}>
                {activeShift.is_paused ? "Resume" : "Pause"}
            </Button>
            <Button onClick={handleEndShift} danger>
                End Shift
            </Button>
        </Card>
    );
};

export default ActiveShiftCard;
t