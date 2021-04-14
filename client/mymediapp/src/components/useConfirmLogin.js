import { useState, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../config";

export default function useConfirmLogin(initialValue = null) {
  const [isConfirmed, setIsConfirmed] = useState(initialValue);

  const isLoggedInServer = useCallback(async () => {
    console.log("로그인 되어있는지 확인");

    const AuthStr = `Bearer ${localStorage.getItem("access_token")}`;
    const res = await axios.get(serverUrl + "/googleOauth/protected", {
      headers: {
        Authorization: AuthStr,
      },
    });

    if (res.data.status === 200) {
      setIsConfirmed(true);
    } else {
      window.location.replace(window.location.href);
      setIsConfirmed(false);
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
      console.log("log out");
    }
  }, []);

  return [isConfirmed, isLoggedInServer];
}
