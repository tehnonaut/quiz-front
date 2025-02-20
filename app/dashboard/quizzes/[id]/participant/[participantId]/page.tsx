"use client";

import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getQuizParticipantResultsRequest } from "@/api/quiz";
import { Badge } from "@/components/ui/badge";

export default function QuizParticipantResultsPage() {
  const { id: quizId, participantId } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["getQuizParticipantResultsRequest", quizId, participantId],
    queryFn: () =>
      getQuizParticipantResultsRequest({
        quizId: quizId as string,
        participantId: participantId as string,
      }),
    enabled: !!quizId && !!participantId,
  });

  if (!data) return <p className="pt-10 text-center">Loading...</p>;
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
                <BreadcrumbLink href={`/dashboard/quizzes/${quizId}/results`}>
                  Quiz results
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <BreadcrumbLink>Participant results</BreadcrumbLink>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="bg-muted p-4 rounded-xl">
        <p className="font-bold text-xl mb-1">{data.quiz.title}</p>
        <p className="text-gray-500 text-sm">{data.quiz.description}</p>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{data.participant.name}</h1>
          <Badge
            variant={data.participant.isCompleted ? "default" : "destructive"}
          >
            {data.participant.isCompleted ? "Completed" : "Not Completed"}
          </Badge>
        </div>
        <p>{data.participant.studentId}</p>
      </div>
      <div>
        {data.results.map((result, index) => (
          <div key={result.question} className="p-4 rounded-xl my-4 border">
            <p className="text-lg font-bold">
              {index + 1}. {result.question}
            </p>
            <p className="my-2">{result.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
