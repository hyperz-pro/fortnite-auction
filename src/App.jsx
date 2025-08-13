import { useState, useEffect } from "react";

const days = [
    { id: 1, name: "Wednesday - Week 1" },
    { id: 2, name: "Thursday - Week 1" },
    { id: 3, name: "Wednesday - Week 2" },
    { id: 4, name: "Thursday - Week 2" },
    { id: 5, name: "Wednesday - Week 3" },
    { id: 6, name: "Thursday - Week 3" },
];

const divisions = [2, 3, 4, 5];

function App() {
    // Load bids from localStorage or initialize empty
    const [bids, setBids] = useState(() => {
        const saved = localStorage.getItem("bids");
        return saved
            ? JSON.parse(saved)
            : days.reduce((acc, day) => ({ ...acc, [day.id]: [] }), {});
    });

    const [inputs, setInputs] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: { amount: "", discord: "" } }), {})
    );

    const [selectedDivisions, setSelectedDivisions] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: 2 }), {})
    );

    // Save bids to localStorage whenever bids change
    useEffect(() => {
        localStorage.setItem("bids", JSON.stringify(bids));
    }, [bids]);

    const handleInputChange = (dayId, field, value) => {
        setInputs({
            ...inputs,
            [dayId]: { ...inputs[dayId], [field]: value },
        });
    };

    const handleDivisionChange = (dayId, value) => {
        setSelectedDivisions({ ...selectedDivisions, [dayId]: Number(value) });
    };

    const handleSubmit = (dayId) => {
        const bidValue = Number(inputs[dayId].amount);
        const discordName = inputs[dayId].discord.trim();

        if (!bidValue || bidValue <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }
        if (!discordName) {
            alert("Please enter your Discord name.");
            return;
        }

        // Add bid to the list for that day
        setBids({
            ...bids,
            [dayId]: [...bids[dayId], { amount: bidValue, discord: discordName, division: selectedDivisions[dayId] }],
        });

        // Clear input fields
        setInputs({
            ...inputs,
            [dayId]: { amount: "", discord: "" },
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-2">Fortnite Boosting Bids</h1>
            <p className="text-gray-400 mb-8 text-center max-w-xl">
                I am a heats/group stage qualified player in the <span className="text-yellow-400">top 0.001%</span>.
                Choose your day, select your division (2–5), enter your Discord name, and place your bid to be boosted by a top-tier player.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                {days.map((day) => {
                    const dayBids = bids[day.id];
                    const highestBidEntry = dayBids.length > 0
                        ? dayBids.reduce((max, b) => (b.amount > max.amount ? b : max), dayBids[0])
                        : null;

                    return (
                        <div key={day.id} className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-xl shadow-lg flex flex-col">
                            <h2 className="text-xl font-semibold mb-4">{day.name}</h2>

                            <label className="mb-1 text-sm">Select Division:</label>
                            <select
                                value={selectedDivisions[day.id]}
                                onChange={(e) => handleDivisionChange(day.id, e.target.value)}
                                className="mb-4 p-2 rounded bg-gray-800 text-white focus:outline-none"
                            >
                                {divisions.map((div) => (
