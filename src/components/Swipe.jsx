import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Swipe() {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [matchMessage, setMatchMessage] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      const snap = await getDocs(collection(db, "profiles"));
      const all = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.id !== auth.currentUser.uid && p.name);
      setProfiles(all);
    };
    loadProfiles();
  }, []);

  const handleLike = async (likedUserId) => {
    const myId = auth.currentUser.uid;

    await setDoc(doc(db, "likes", `${myId}_${likedUserId}`), {
      from: myId,
      to: likedUserId,
      createdAt: Date.now(),
    });

    const theirLikeSnap = await getDoc(doc(db, "likes", `${likedUserId}_${myId}`));

    if (theirLikeSnap.exists()) {
      const matchId = [myId, likedUserId].sort().join("_");
      await setDoc(doc(db, "matches", matchId), {
        users: [myId, likedUserId],
        createdAt: Date.now(),
      });
      setMatchMessage("It's a match! 🎉 Check your Matches tab to chat.");
      setTimeout(() => setMatchMessage(""), 3000);
    }

    setIndex((i) => i + 1);
  };

  const handlePass = () => setIndex((i) => i + 1);

  if (index >= profiles.length) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>No more profiles right now — check back later!</p>;
  }

  const current = profiles[index];

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", fontFamily: "sans-serif", textAlign: "center" }}>
      {matchMessage && <p style={{ color: "green", fontWeight: "bold" }}>{matchMessage}</p>}
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        {current.photoURL && (
          <img src={current.photoURL} alt={current.name} style={{ width: "100%", borderRadius: 8 }} />
        )}
        <h3>{current.name}, {current.age}</h3>
        <p>{current.bio}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
        <button onClick={handlePass} style={{ padding: "10px 24px" }}>✕ Pass</button>
        <button onClick={() => handleLike(current.id)} style={{ padding: "10px 24px" }}>♥ Like</button>
      </div>
    </div>
  );
}
