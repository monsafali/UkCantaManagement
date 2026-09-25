import { useEffect } from "react";
import useAuthStore from "../store/authStore";

export default function AuthInitializer({ children }) {
  const getMe = useAuthStore((state) => state.getMe);

  useEffect(() => {
    getMe();
  }, [getMe]);

  return children;
}
