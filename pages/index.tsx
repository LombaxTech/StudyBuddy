import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useEffect } from "react";

import { app, auth, db } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import SetupAccount from "@/components/SetupAccount";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {}, [user, userLoading]);

  if (!userLoading && user?.setup === false) return <SetupAccount />;

  return <div className="">{!user && <div>No user found</div>}</div>;
}
