"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteWhitelist } from "@/server/whitelist/deleteWhitelist";
import { useToast } from "@/hooks/use-toast";
import { AddUserModal } from "./addUser";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type Email = string;

export interface DeleteEmailResult {
  success: boolean;
  message: string;
}

export interface WhitelistManagerProps {
  initialWhitelist: Email[];
}

export function WhitelistManager({
  initialWhitelist,
}: WhitelistManagerProps): JSX.Element {
  const [whitelist, setWhitelist] = useState<Email[]>(initialWhitelist);
  const [selectedEmails, setSelectedEmails] = useState<Set<Email>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();

  function handleCheckboxChange(email: Email): void {
    setSelectedEmails(function (prev: Set<Email>): Set<Email> {
      const newSet = new Set(prev);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });
  }

  async function handleDelete(): Promise<void> {
    const emailsToDelete = Array.from(selectedEmails);
    try {
      const results: DeleteEmailResult[] = await Promise.all(
        emailsToDelete.map(function (email: Email): Promise<DeleteEmailResult> {
          return deleteWhitelist(email);
        }),
      );

      const successCount = results.filter(function (
        result: DeleteEmailResult,
      ): boolean {
        return result.success;
      }).length;
      const failCount = emailsToDelete.length - successCount;

      setWhitelist(function (prev: Email[]): Email[] {
        return prev.filter(function (email: Email): boolean {
          return !selectedEmails.has(email);
        });
      });
      setSelectedEmails(new Set());

      if (successCount > 0) {
        toast({
          title: "Emails deleted",
          description: `${successCount} email(s) have been removed from the whitelist.`,
        });
      }
      if (failCount > 0) {
        toast({
          title: "Error",
          description: `Failed to delete ${failCount} email(s).`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting emails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting emails.",
        variant: "destructive",
      });
    } finally {
    }
  }

  const filteredWhitelist = whitelist.filter(function (email: Email): boolean {
    return email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Email Whitelist</h1>
        <div className="space-x-4">
          <AddUserModal />
          <Button
            onClick={handleDelete}
            disabled={selectedEmails.size === 0}
            variant="destructive"
          >
            Eliminar de la lista
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar emails..."
          value={searchTerm}
          onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
            setSearchTerm(e.target.value);
          }}
          className="pl-8"
        />
      </div>
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Seleccionar</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWhitelist.map(function (email: Email): JSX.Element {
            return (
              <TableRow key={email}>
                <TableCell>
                  <Checkbox
                    id={email}
                    checked={selectedEmails.has(email)}
                    onCheckedChange={function (): void {
                      handleCheckboxChange(email);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <label
                    htmlFor={email}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {email}
                  </label>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {filteredWhitelist.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No emails found in the whitelist.
        </div>
      )}
    </div>
  );
}
