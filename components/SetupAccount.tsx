import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function SetupAccount() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState<any>(user?.name || user?.displayName);
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const [error, setError] = useState<any>(false);

  const [subjects, setSubjects] = useState<any>([]);
  const [subjectInput, setSubjectInput] = useState<any>("");

  const finishProfileSetup = async () => {
    setError(false);

    if (subjects.length === 0) {
      return setError(true);
      // todo: error you have to add one subject!
    }

    let imageUrl;

    // todo: Upload image if image
    // if (file) {
    //   const fileRef = `profilePictures/${user.uid}/${file.name}`;

    //   const storageRef = ref(storage, fileRef);
    //   await uploadBytes(storageRef, file).then((snapshot) => {
    //     console.log("Uploaded a blob or file!");
    //   });

    //   imageUrl = await getDownloadURL(ref(storage, fileRef));
    // }

    const firestoreUser = {
      name,
      email: user.email,
      subjects,
      // profilePictureUrl: imageUrl,
    };

    // setFile(null);

    try {
      await setDoc(doc(db, "users", user.uid), firestoreUser);
      setUser({ ...user, ...firestoreUser, setup: true });
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const addSubject = async () => {
    // todo: dont add subject if already exist

    const randomColor = "red";

    const newSubjects = [
      ...subjects,
      { name: subjectInput, color: randomColor },
    ];
    setSubjects(newSubjects);
    setSubjectInput("");
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <div className="flex flex-col gap-6 lg:w-4/12 w-full">
        <h1 className="font-bold text-xl">Set up your profile</h1>
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
        <div className="flex flex-col gap-4">
          <label>Which subjects would you like to track?</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="border outline-none p-2"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Enter subject name"
            />
            <button className="btn btn-sm" onClick={addSubject}>
              Add Subject
            </button>
          </div>
          {subjects &&
            subjects.map((subject: any) => {
              return (
                <div key={subject.name} className="flex items-center gap-2">
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
                    onClick={() =>
                      setSubjects(
                        subjects.filter((s: any) => s.name !== subject.name)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>

        <button className="btn btn-primary" onClick={finishProfileSetup}>
          Finish Profile Set Up
        </button>
        {error && (
          <div className="bg-red-200 p-2 text-red-800 text-center">
            Please fill in all fields
          </div>
        )}
      </div>
      {/* <div className="flex flex-col my-4">
        <label>Upload profile picture</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e: any) => setFile(e.target.files[0])}
          // style={{ display: "none" }}
        />
        {file && (
          <div className="relative">
            <img src={URL.createObjectURL(file)} width="100" />
            <div className="cursor-pointer" onClick={() => setFile(null)}>
              Delete
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
