"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { exportDatabase } from "@/server/downloadStatistics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExportDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDatabaseButton(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleOpenModal(): void {
    setIsModalOpen(true);
  }

  function handleCloseModal(): void {
    setIsModalOpen(false);
  }

  return (
    <>
      <Button onClick={handleOpenModal}>Exportar Data</Button>
      <ExportDatabaseModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

function ExportDatabaseModal({
  isOpen,
  onClose,
}: ExportDatabaseModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function handleExport(): Promise<void> {
    setIsLoading(true);
    try {
      const url = await exportDatabase();
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error exporting database:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCSVDownload(): void {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  }

  async function handleXLSXDownload(): Promise<void> {
    if (downloadUrl) {
      setIsLoading(true);
      try {
        const response = await fetch(downloadUrl);
        const text = await response.text();
        const workbook = XLSX.read(text, { type: "string" });
        XLSX.writeFile(workbook, "database_export.xlsx");
      } catch (error) {
        console.error("Error converting CSV to XLSX:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Empezar Exportación</DialogTitle>
          <DialogDescription>
            Escoje el formato en el cual deseas exportar la data
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4 mt-4">
          {!downloadUrl ? (
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? "Exportando..." : "Exportar"}
            </Button>
          ) : (
            <>
              <Button onClick={handleCSVDownload} disabled={isLoading}>
                Descargar en CSV
              </Button>
              <Button onClick={handleXLSXDownload} disabled={isLoading}>
                {isLoading ? "Convirtiendo..." : "Descargar en XLSX"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
