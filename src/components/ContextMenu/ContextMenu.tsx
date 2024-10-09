import React, { useState, useEffect, useRef } from "react";
import "./style.css";

const ContextMenu = ({ onSelect, onDelete }) => {
  return (
    <ul className="context-menu">
      <li onClick={onSelect} className="select">
        Select
      </li>
      <li onClick={onDelete} className="delete">
        Delete
      </li>
    </ul>
  );
};

export default ContextMenu;
