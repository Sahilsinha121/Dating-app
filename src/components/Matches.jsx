import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Chat({ matchId, otherName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "matches", matchId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
    });
    return unsub;
  }, [matchId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "matches", matchId, "messages"), {
      text,
      from: auth.currentUser.uid,
      createdAt: Date.now(),
    });
    setText("");
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 8 }}>
      <h4>{otherName}</h4>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <p
            key={i}
            style={{
              textAlign: m.from === auth.currentUser.uid ? "right" : "left",
              margin: "4px 0",
            }}
          >
            <span style={{ background: "#eee", padding: "4px 8px", borderRadius: 8 }}>{m.text}</span>
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 4 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [openMatchId, setOpenMatchId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "matches"),
      where("users", "array-contains", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, async (snap) => {
      const results = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const otherId = data.users.find((u) => u !== auth.currentUser.uid);
          const otherSnap = await getDoc(doc(db, "profiles", otherId));
          return { id: d.id, otherName: otherSnap.data()?.name || "Someone" };
        })
      );
      setMatches(results);
    });
    return unsub;
  }, []);

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Your Matches</h2>
      {matches.length === 0 && <p>No matches yet — go like some profiles!</p>}
      {matches.map((m) => (
        <div key={m.id}>
          <button
            onClick={() => setOpenMatchId(openMatchId === m.id ? null : m.id)}
            style={{ width: "100%", padding: 10, textAlign: "left" }}
          >
            {m.otherName}
          </button>
          {openMatchId === m.id && <Chat matchId={m.id} otherName={m.otherName} />}
        </div>
      ))}
    </div>
  );
                                   }
