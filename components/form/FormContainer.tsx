"use client";

import { ActionFunction } from "@/utils/types";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";

type FormContainerProps = {
  children: React.ReactNode;
  action: ActionFunction;
};

const initialState = { message: "" };

function FormContainer({ children, action }: FormContainerProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
