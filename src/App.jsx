import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Swipe from "./components/Swipe";
import Matches from "./components/Matches";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("swipe");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  if (!user) return <Auth />;

  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "center", gap: 16, padding: 12, borderBottom: "1px solid #ddd" }}>
        <button onClick={() => setTab("swipe")}>Browse</button>
        <button onClick={() => setTab("matches")}>Matches</button>
        <button onClick={() => setTab("profile")}>My Profile</button>
        <button onClick={() => signOut(auth)}>Log Out</button>
      </nav>
      {tab === "swipe" && <Swipe />}
      {tab === "matches" && <Matches />}
      {tab === "profile" && <Profile />}
    </div>
  );
                   }
