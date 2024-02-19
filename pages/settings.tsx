import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getRandomElement } from "@/helperFunctions";
import { colorNames } from "@/data";
import { Select, SelectItem } from "@tremor/react";

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState<any>(user?.name || user?.displayName);

  const [subjects, setSubjects] = useState<any>(user?.subjects || []);
  const [subjectInput, setSubjectInput] = useState<any>("");

  const [changesExist, setChangesExist] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [error, setError] = useState(false);

  const [subjectToBeEdited, setSubjectToBeEdited] = useState<any>("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (user) setSubjects(user.subjects);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (user.name !== name && name !== "") {
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

  const addSubject = async () => {
    const subjectAlreadyExists = subjects.filter(
      (s: any) => s.name === subjectInput
    ).length;

    try {
      if (subjectAlreadyExists) return;

      await updateDoc(doc(db, "users", user.uid), {
        subjects: arrayUnion({
          name: subjectInput,
          color: getRandomElement(colorNames),
        }),
      });

      setSubjectInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const removeSubject = async (subject: any) => {
    try {
      const updatedSubjects = subjects.filter(
        (s: any) => s.name !== subject.name
      );

      await updateDoc(doc(db, "users", user.uid), {
        subjects: updatedSubjects,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateSubjectColor = async (subject: any) => {
    try {
      const updatedSubjects = subjects.map((s: any) => {
        if (s.name === subject.name) {
          return {
            ...s,
            color,
          };
        } else return s;
      });

      await updateDoc(doc(db, "users", user.uid), {
        subjects: updatedSubjects,
      });

      setSubjectToBeEdited("");
    } catch (error) {
      console.log(error);
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
                const isEditing = subjectToBeEdited === subject.name;

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
                    <span className="text-xs font-thin">{subject.color}</span>
                    <span
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        if (isEditing) {
                          setSubjectToBeEdited("");
                        } else {
                          setSubjectToBeEdited(subject.name);
                        }
                      }}
                    >
                      {isEditing ? "Cancel" : "Edit Color"}
                    </span>
                    {isEditing && (
                      <div className="flex items center gap-2">
                        <Select
                          value={color}
                          onValueChange={setColor}
                          className="mt-2"
                        >
                          {colorNames.map((colorName) => {
                            return (
                              <SelectItem value={colorName}>
                                {colorName}
                              </SelectItem>
                            );
                          })}
                        </Select>
                        <button
                          onClick={() => updateSubjectColor(subject)}
                          className="btn"
                          disabled={color === "" || color === subject.color}
                        >
                          Save
                        </button>
                      </div>
                    )}
                    <button
                      className="btn btn-sm"
                      onClick={() => removeSubject(subject)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="flex items center gap-1">
            <input
              type="text"
              className="flex-1 outline-none border-1"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
            />
            <button className="btn" onClick={addSubject}>
              Add Subject
            </button>
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
