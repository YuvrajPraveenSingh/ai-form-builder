"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, use } from "react";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { FormGeneratorAction } from "@/app/actions/FormGeneratorAction";
import { useFormState, useFormStatus } from "react-dom";

type Props = {};

type initialStateType = {
  message?: string;
  data?: any;
};

const initialState: initialStateType = {
  message: "",
};

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const [state, formAction] = useFormState(FormGeneratorAction, initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state && state.message) {
      if (state.message.includes("Error")) {
        setErrorMessage(state.message);
      } else {
        console.log( state.data);
        setOpen(false);
      }
    }
  }, [state]);
  const handleFormCreate = () => {
    setOpen(true);
  };

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setErrorMessage("");
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button onClick={handleFormCreate}>Create Form</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create A New Form</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <Textarea
                className="h-48 w-full"
                id="description"
                name="description"
                required
                placeholder="Share what your form is about here , what is it for? who is it for? And What information are you looking to collect .  AI will do the magic and create the form for you"
              />
            </div>
            {errorMessage && <p className="text-red-500 m-4">{errorMessage}</p>}

            <DialogFooter className="flex flex-col justify-between">
              <SubmitButton />
              <Button variant="link">Create Manually</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormGenerator;
