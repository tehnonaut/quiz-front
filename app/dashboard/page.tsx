"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Check,
  CircleOffIcon,
  CopyIcon,
  Loader,
  MoreHorizontal,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteQuizRequest, getQuizListRequest } from "@/api/quiz";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [quizForDelete, setQuizForDelete] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["quiz-list"],
    queryFn: getQuizListRequest,
  });

  const { mutate: deleteQuizMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteQuizRequest,
    onSuccess: () => {
      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
      setQuizForDelete("");
    },
  });

  const handleUpdate = (id: string) => {
    console.log("Update", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete", id);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Quizzes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <Button>
            <a href="/dashboard/quizzes/manage">Create Quiz</a>
          </Button>
        </div>
        {isPending ? (
          <p className="flex items-center gap-4 justify-center pt-10">
            <Loader size={24} className="animate-spin" />
            Please wait...
          </p>
        ) : (
          <div className="rounded-xl bg-card">
            {data?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead># of Questions</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((quiz) => (
                    <TableRow key={quiz._id}>
                      <TableCell>
                        {quiz.title}
                        <br />
                        <p className="inline-flex items-center gap-1 text-sm text-gray-500">
                          .../quiz/{quiz._id}
                          <CopyIcon
                            size={16}
                            className="cursor-pointer"
                            onClick={() => {
                              const URL = `${window.location.origin}/quiz/${quiz._id}`;
                              navigator.clipboard.writeText(URL);
                              toast({
                                title: "Link copied",
                                description:
                                  "The link has been copied to clipboard",
                              });
                            }}
                          />
                        </p>
                      </TableCell>
                      <TableCell title={quiz.description}>
                        {quiz.description.slice(0, 30) + "..."}
                      </TableCell>
                      <TableCell>{quiz.duration}min.</TableCell>
                      <TableCell>{quiz.questions.length || 0}</TableCell>
                      <TableCell>
                        {quiz.isActive ? (
                          <Check size={18} color="green" />
                        ) : (
                          <X size={18} color="#c00" />
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <a href={`/dashboard/quizzes/${quiz._id}/results`}>
                              <DropdownMenuItem>See results</DropdownMenuItem>
                            </a>
                            <a
                              href={`/dashboard/quizzes/manage?quizId=${quiz._id}`}
                            >
                              <DropdownMenuItem>Update</DropdownMenuItem>
                            </a>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setQuizForDelete(quiz._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="pt-10 flex flex-col gap-5 items-center justify-center">
                <CircleOffIcon className="text-red-500" size={32} />
                <p className="text-center italic">
                  No quizzes found.
                  <br />
                  <a
                    href="/dashboard/quizzes/manage"
                    className="hover:underline font-bold"
                  >
                    Create your first quiz.
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <AlertDialog open={!!quizForDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete quiz
              and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuizForDelete("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteQuizMutation(quizForDelete)}
              disabled={isDeleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
