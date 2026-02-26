import { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
}

export function FileUpload({ label, accept, multiple = false, maxFiles = 1, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    const next = multiple ? [...files, ...arr].slice(0, maxFiles) : arr.slice(0, 1);
    setFiles(next);
    onChange?.(next);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange?.(next);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-warm-700">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          dragging
            ? 'border-primary-400 bg-primary-50'
            : 'border-warm-300 hover:border-primary-300 hover:bg-warm-50',
        )}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-warm-400" />
        <p className="text-sm text-warm-500">
          클릭하거나 파일을 드래그하세요
        </p>
        {multiple && (
          <p className="text-xs text-warm-400 mt-1">최대 {maxFiles}개</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative group">
              {isImage(file) ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-24 h-24 object-cover rounded-lg border border-warm-200"
                />
              ) : (
                <div className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border border-warm-200 bg-warm-50 p-2">
                  <FileText className="w-8 h-8 text-warm-400 mb-1" />
                  <span className="text-xs text-warm-500 truncate w-full text-center">
                    {file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
