import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";

export default function Profile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [file, setFile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "profiles", auth.currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setBio(data.bio || "");
        setAge(data.age || "");
        setPhotoURL(data.photoURL || "");
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    let uploadedURL = photoURL;

    if (file) {
      const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      uploadedURL = await getDownloadURL(storageRef);
    }

    await setDoc(
      doc(db, "profiles", auth.currentUser.uid),
      { name, bio, age: Number(age), photoURL: uploadedURL, email: auth.currentUser.email },
      { merge: true }
    );
    setPhotoURL(uploadedURL);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Your Profile</h2>
      <form onSubmit={handleSave}>
        {photoURL && (
          <img src={photoURL} alt="profile" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "block", marginBottom: 8 }}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={18}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Save Profile
        </button>
        {saved && <p style={{ color: "green" }}>Saved!</p>}
      </form>
    </div>
  );
}
