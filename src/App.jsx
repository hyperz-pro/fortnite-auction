import { useState } from "react";

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
    const [bids, setBids] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: [] }), {})
    );

    const [inputs, setInputs] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: "" }), {})
    );

    const [selectedDivisions, setSelectedDivisions] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: 2 }), {}) // default division 2
    );

    const handleInputChange = (dayId, value) => {
        setInputs({ ...inputs, [dayId]: value });
    };

    const handleDivisionChange = (dayId, value) => {
        setSelectedDivisions({ ...selectedDivisions, [dayId]: Number(value) });
    };

    const handleSubmit = (dayId) => {
        const bidValue = Number(inputs[dayId]);
        if (!bidValue || bidValue <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }

        setBids({
            ...bids,
            [dayId]: [...bids[dayId], bidValue],
        });

        setInputs({ ...inputs, [dayId]: "" });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-2">Fortnite Boosting Bids</h1>
            <p className="text-gray-400 mb-8 text-center max-w-xl">
                I am a heats/group stage qualified player in the <span className="text-yellow-400">top 0.001%</span>.
                Choose your day, select your division (2–5), and place your bid to be boosted by a top-tier player.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                {days.map((day) => {
                    const dayBids = bids[day.id];
                    const highestBid = dayBids.length > 0 ? Math.max(...dayBids) : null;

                    return (
                        <div key={day.id} className="bg-gradient-to-br from-purple-700 to-pink-600 p-6 rounded-xl shadow-lg flex flex-col">
                            <h2 className="text-xl font-semibold mb-4">{day.name}</h2>

                            <label className="mb-2 text-sm">Select Division:</label>
                            <select
                                value={selectedDivisions[day.id]}
                                onChange={(e) => handleDivisionChange(day.id, e.target.value)}
                                className="mb-4 p-2 rounded bg-gray-800 text-white focus:outline-none"
                            >
                                {divisions.map((div) => (
                                    <option key={div} value={div}>
                                        Division {div}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Enter your bid ($)"
                                value={inputs[day.id]}
                                onChange={(e) => handleInputChange(day.id, e.target.value)}
                                className="mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-300 focus:outline-none"
                            />
                            <button
                                onClick={() => handleSubmit(day.id)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded font-bold transition"
                            >
                                Submit Bid
                            </button>

                            {highestBid !== null && (
                                <p className="mt-4 text-green-200">
                                    Highest Bid: ${highestBid} | Division {selectedDivisions[day.id]}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
