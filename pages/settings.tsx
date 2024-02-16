import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState<any>(user?.name || user?.displayName);

  const [subjects, setSubjects] = useState<any>(user?.subjects || []);
  const [subjectInput, setSubjectInput] = useState<any>("");

  const [changesExist, setChangesExist] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.name !== name) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [user, name]);

  const saveChanges = async () => {
    setError(false);
    setChangesSaved(false);

    if (!changesExist) return;

    try {
      await updateDoc(doc(db, "users", user.uid), { name });
      setChangesSaved(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  if (user)
    return (
      <div className="p-10 flex flex-col items-center">
        <div className="flex flex-col gap-6 lg:w-4/12 w-full">
          <h1 className="font-bold text-xl">Edit Profile</h1>
          <div className="flex flex-col gap-2">
            <label>Name: </label>
            <input
              type="text"
              className="border outline-none p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>My subjects: </label>
            {subjects &&
              subjects.map((subject: any) => {
                return (
                  <div className="flex items-center gap-2">
                    <div className="w-3/12">
                      <span
                        className="p-2 bg-gray-300 rounded-lg text-xs"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name}
                      </span>
                    </div>
                    <span className="cursor-pointer text-xs">Edit color</span>
                    <button
                      className="btn btn-sm"
                      //   onClick={() =>
                      //     setSubjects(
                      //       subjects.filter((s: any) => s.name !== subject.name)
                      //     )
                      //   }
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
          </div>
          <button
            disabled={!changesExist}
            className="btn btn-primary"
            onClick={saveChanges}
          >
            Save Changes
          </button>

          {error && (
            <div className="bg-red-200 p-2 text-red-800 text-center">
              Something went wrong. Please try again.
            </div>
          )}
          {changesSaved && (
            <div className="bg-green-200 p-2 text-green-800 text-center">
              Changes saved successfully.
            </div>
          )}
        </div>
      </div>
    );
}
