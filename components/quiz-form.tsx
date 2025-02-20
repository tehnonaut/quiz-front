"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuizFormProps {
  onStart: (details: { name: string; studentId: string }) => void;
}

export default function QuizForm({ onStart }: QuizFormProps) {
  const [values, setValues] = useState({
    name: "",
    studentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ ...values });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto border p-6 rounded-lg"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome to the Quiz!</h1>
        <p className="text-gray-500">
          Please enter your full name and student ID to start.
        </p>
      </div>
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          value={values.studentId}
          onChange={(e) =>
            setValues((p) => ({ ...p, studentId: e.target.value }))
          }
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Start Quiz
      </Button>
    </form>
  );
}
