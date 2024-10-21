"use client";

import { useParams } from "next/navigation";
import React from "react";

const Dashboard = () => {
    const { id } = useParams();
    return <div>Dashboard {id}</div>;
};

export default Dashboard;
