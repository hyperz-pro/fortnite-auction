import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDTKJ1upb8JDX2G_fQFLk74LP8U7f2UPfs",
    authDomain: "fortnite-auction.firebaseapp.com",
    databaseURL: "https://fortnite-auction-default-rtdb.firebaseio.com",
    projectId: "fortnite-auction",
    storageBucket: "fortnite-auction.appspot.com",
    messagingSenderId: "189441008296",
    appId: "1:189441008296:web:bb9929d5b3ae1d6c19589d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
        days.reduce((acc, day) => ({ ...acc, [day.id]: { amount: "", discord: "" } }), {})
    );

    const [selectedDivisions, setSelectedDivisions] = useState(
        days.reduce((acc, day) => ({ ...acc, [day.id]: 2 }), {})
    );

    const textShadow = "2px 2px 4px rgba(0,0,0,0.8)";

    // Load live bids from Firebase
    useEffect(() => {
        days.forEach(day => {
            const dayRef = ref(db, `bids/${day.id}`);
            onValue(dayRef, (snapshot) => {
                const data = snapshot.val() || [];
                setBids(prev => ({ ...prev, [day.id]: Object.values(data) }));
            });
        });
    }, []);

    const handleInputChange = (dayId, field, value) => {
        setInputs({ ...inputs, [dayId]: { ...inputs[dayId], [field]: value } });
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

        const dayRef = ref(db, `bids/${dayId}`);
        push(dayRef, { amount: bidValue, discord: discordName, division: selectedDivisions[dayId] });

        setInputs({ ...inputs, [dayId]: { amount: "", discord: "" } });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: "url('https://cdn2.unrealengine.com/en-en-fnce-37-00-globalchampionship-discoverytile-division1cup-1920x1080-1920x1080-6eaed3100d61.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2.5rem",
                color: "white",
            }}
        >
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", textShadow }}>
                Fortnite Div Cup Carry
            </h1>

            <p style={{ color: "#D1D5DB", marginBottom: "2rem", textAlign: "center", maxWidth: "40rem" }}>
                I am a heats/group stage qualified player in the <span style={{ color: "#FACC15", fontWeight: "bold" }}>top 0.001%</span>.
                Choose your day, select your division (2-5), enter your Discord name, and place your bid to be boosted by a top-tier player.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", width: "100%", maxWidth: "64rem" }}>
                {days.map((day) => {
                    const dayBids = bids[day.id];
                    const highestBidEntry = dayBids.length > 0
                        ? dayBids.reduce((max, b) => (b.amount > max.amount ? b : max), dayBids[0])
                        : null;

                    return (
                        <div key={day.id} style={{
                            background: "linear-gradient(to bottom right, #FACC15, #3B82F6)",
                            padding: "1.5rem",
                            borderRadius: "1rem",
                            boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem", color: "#FFFFFF", textShadow }}>
                                {day.name}
                            </h2>

                            <label style={{ marginBottom: "0.25rem", fontSize: "0.875rem", color: "red" }}>Select Division:</label>
                            <select
                                value={selectedDivisions[day.id]}
                                onChange={(e) => handleDivisionChange(day.id, e.target.value)}
                                style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.375rem", backgroundColor: "#1F2937", color: "red", border: "none" }}
                            >
                                {divisions.map((div) => (
                                    <option key={div} value={div}>
                                        Division {div}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Enter your Discord name"
                                value={inputs[day.id].discord}
                                onChange={(e) => handleInputChange(day.id, "discord", e.target.value)}
                                style={{ marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "0.375rem", backgroundColor: "#374151", color: "#3B82F6", border: "none", fontWeight: "600", width: "100%" }}
                            />

                            <input
                                type="number"
                                placeholder="Enter your bid ($)"
                                value={inputs[day.id].amount}
                                onChange={(e) => handleInputChange(day.id, "amount", e.target.value)}
                                style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.375rem", backgroundColor: "#374151", color: "white", border: "none", fontWeight: "600", width: "100%" }}
                            />

                            <button
                                onClick={() => handleSubmit(day.id)}
                                style={{ backgroundColor: "#FACC15", color: "black", padding: "0.5rem 1rem", borderRadius: "0.375rem", fontWeight: "bold", cursor: "pointer" }}
                            >
                                Submit Bid
                            </button>

                            {highestBidEntry && (
                                <p style={{ marginTop: "1rem", color: "limegreen", fontWeight: "700", fontSize: "1rem", textShadow }}>
                                    Highest Bid: ${highestBidEntry.amount} | Discord: {highestBidEntry.discord} | Division {highestBidEntry.division}
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
