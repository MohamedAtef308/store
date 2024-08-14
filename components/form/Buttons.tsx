"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import { useEffect } from "react";

type BtnSizes = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: BtnSizes;
};

export function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) {
  const { pending,data } = useFormStatus();

  useEffect( ()=> {
    console.log(data);
    
  }, [data])

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("capitalize", className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type ActionType = "edit" | "delete";

export function IconButton({actionType}: {actionType:ActionType}) {
  const {pending} = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <LuPenSquare/>
      case "delete":
        return <LuTrash2/>
      default:
          throw new Error(`Invalid action type: ${actionType}`)
    }
  }

  return (
    <Button size="icon" type="submit" variant="link" className="p-2 cursor-pointer">
      {
        pending? <ReloadIcon className="animate-spin"/> : renderIcon()
      }
    </Button>
  )
}