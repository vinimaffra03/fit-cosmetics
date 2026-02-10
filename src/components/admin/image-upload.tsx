"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  alt?: string;
  id?: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        toast.error(`Maximo de ${maxImages} imagens`);
        return;
      }

      const toUpload = fileArray.slice(0, remaining);
      setUploading(true);

      try {
        const uploaded: UploadedImage[] = [];
        for (const file of toUpload) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} excede 5MB`);
            continue;
          }
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            toast.error(data.error || "Erro no upload");
            continue;
          }

          const { url } = await res.json();
          uploaded.push({ url, alt: file.name.replace(/\.[^.]+$/, "") });
        }

        if (uploaded.length > 0) {
          onChange([...images, ...uploaded]);
          toast.success(
            `${uploaded.length} imagem(ns) enviada(s)`
          );
        }
      } catch {
        toast.error("Erro no upload");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || uploading) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, uploading, handleFiles]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
          disabled || uploading
            ? "border-muted bg-muted/50 cursor-not-allowed"
            : "border-muted-foreground/25 hover:border-primary/50 cursor-pointer"
        )}
        onClick={() => {
          if (disabled || uploading) return;
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/jpeg,image/png,image/webp,image/avif";
          input.multiple = true;
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) handleFiles(files);
          };
          input.click();
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Enviando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste imagens ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP ou AVIF. Max 5MB. {images.length}/{maxImages}
            </p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div
              key={img.url}
              className="relative group rounded-xl overflow-hidden border bg-muted aspect-square"
            >
              <Image
                src={img.url}
                alt={img.alt || "Produto"}
                fill
                className="object-cover"
                sizes="150px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    onClick={() => moveImage(i, -1)}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                )}
                {i < images.length - 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    onClick={() => moveImage(i, 1)}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => removeImage(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
