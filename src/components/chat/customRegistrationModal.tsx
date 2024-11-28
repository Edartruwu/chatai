"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UserProfileForm } from "./userForm";

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps): JSX.Element | null {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(function () {
    setMounted(true);
    return function () {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function CustomRegistrationModal() {
  return (
    <Modal>
      <UserProfileForm />
    </Modal>
  );
}
