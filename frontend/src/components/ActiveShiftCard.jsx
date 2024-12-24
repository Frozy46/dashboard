import React from "react";
import { Card, Button } from "antd";
import Timer from "./Timer";

const ActiveShiftCard = ({ activeShift, handlePauseResume, handleEndShift }) => {
    return (
        <Card>
            <h1>Зміна {activeShift.name}</h1>
            <h2>Ціль: {activeShift.goal}</h2>
            <h2>Початок зміни: {new Date(activeShift.start_time).toLocaleTimeString()}</h2>
            <Timer initialSeconds={activeShift.remaining_time}/>
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
