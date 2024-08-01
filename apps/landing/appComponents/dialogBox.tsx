import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboboxDemo } from "../appComponents/dropdown";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
function getRandomId() {
  const SLUG_WORKS = [
    "cool",
    "coder",
    "awesome",
    "cringe",
    "worker",
    "intelligent",
    "rider",
    "load",
    "network",
    "open",
    "source",
  ];
  let slug = "";
  for (let i = 0; i < 3; i++) {
    slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
  }
  return slug;
}

export function DialogDemo() {
  const [value, setValue] = useState(getRandomId());
  const [language, setLanguage] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const username = user ? `${user.fullName}${user.id}` : "";
  const handleSubmit = async () => {
    try {
      const resp = await axios.get(
        `http://localhost:8000/getToken?username=${username}&replId=${value}`
      );

      const res = await axios.post("http://localhost:8000/project", {
        replId: value,
        language: language,
      });
      console.log(res.data);
      router.replace(
        `http://localhost:5173/coding/?&replId=${value}&token=${resp.data.token}`
      );
    } catch (error) {
      console.log("msg", error);
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create Repl</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose your Environment</DialogTitle>
            <DialogDescription>
              Click Create Repl to create a new environment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Repl Id
              </Label>
              <Input id="name" defaultValue={value} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Language
              </Label>
            </div>
            <ComboboxDemo language={language} setLanguage={setLanguage} />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Join Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
