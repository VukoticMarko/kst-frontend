import React from "react";
import './tooltip.css';

function Tooltip ({ tooltipVisible, tooltipContent, tooltipPosition }) {
    return (
        <div className="tooltip" style={{
            display: tooltipVisible ? 'block' : 'none',
            top: tooltipPosition.y + 'px',
            left: tooltipPosition.x + 'px'
        }}>
            {tooltipContent}
        </div>
    );
}

export default Tooltip;