"use client";

import { getQuizParticipantsRequest } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Check, CircleOffIcon, Loader, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function QuizPage() {
  const { id } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["quiz-results", id],
    queryFn: () => getQuizParticipantsRequest(id as string),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Quizzes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <BreadcrumbLink>Quiz results</BreadcrumbLink>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <h1 className="text-2xl font-bold mt-8">
        All Quiz Participants
        {data?.participants ? ` (${data.participants.length})` : null}
      </h1>
      <div className="bg-muted p-4 rounded-xl">
        <p className="font-bold text-lg">{data?.quiz.title}</p>
        <p className="text-gray-500 text-sm">{data?.quiz.description}</p>
      </div>
      {isPending ? (
        <p className="flex items-center gap-4 justify-center pt-10">
          <Loader size={24} className="animate-spin" />
          Please wait...
        </p>
      ) : (
        <div className="rounded-xl bg-card">
          {data?.participants?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.participants?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.studentId}</TableCell>
                    <TableCell>
                      {item.isCompleted ? (
                        <Check size={18} color="green" />
                      ) : (
                        <X size={18} color="#c00" />
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/dashboard/quizzes/${id}/participant/${item._id}`}
                      >
                        <Button>See results</Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="pt-10 flex flex-col gap-5 items-center justify-center">
              <CircleOffIcon className="text-red-500" size={32} />
              <p className="text-center italic">
                No participants found for this quiz.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
