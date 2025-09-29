import { useEffect } from "react";
import { useLocation } from "wouter";
import HomePage from "./HomePage";
import LoginModal from "@/components/LoginModal";

export default function LoginPage() {
  const [, navigate] = useLocation();

  const handleLoginClose = () => {
    navigate("/");
  };

  return (
    <>
      <HomePage />
      <LoginModal open={true} onOpenChange={(open) => !open && handleLoginClose()} />
    </>
  );
}