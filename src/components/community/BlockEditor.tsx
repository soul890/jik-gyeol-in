import { useRef, useEffect, useCallback, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GripVertical, X, Type, Image, Minus, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase';
import type { Block } from '@/types';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  storagePath: string;
}

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = taRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={taRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      placeholder={placeholder}
      rows={1}
      className="w-full resize-none border-0 bg-transparent text-warm-700 leading-relaxed focus:outline-none focus:ring-0 placeholder:text-warm-300 text-base"
    />
  );
}

function AddBlockBar({ onAdd }: { onAdd: (type: 'text' | 'image' | 'divider') => void }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <div className="h-px flex-1 bg-warm-200" />
      <button
        type="button"
        onClick={() => onAdd('text')}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-warm-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer"
      >
        <Type className="w-3.5 h-3.5" />
        텍스트
      </button>
      <button
        type="button"
        onClick={() => onAdd('image')}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-warm-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer"
      >
        <Image className="w-3.5 h-3.5" />
        사진
      </button>
      <button
        type="button"
        onClick={() => onAdd('divider')}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-warm-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
        구분선
      </button>
      <div className="h-px flex-1 bg-warm-200" />
    </div>
  );
}

export function BlockEditor({ blocks, onChange, storagePath }: BlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertIndexRef = useRef<number>(0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateBlock = (index: number, updated: Block) => {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    onChange(blocks.filter((_, i) => i !== index));
  };

  const insertBlock = (afterIndex: number, type: 'text' | 'image' | 'divider') => {
    if (type === 'image') {
      insertIndexRef.current = afterIndex + 1;
      fileInputRef.current?.click();
      return;
    }

    const newBlock: Block = type === 'text' ? { type: 'text', value: '' } : { type: 'divider' };
    const next = [...blocks];
    next.splice(afterIndex + 1, 0, newBlock);
    onChange(next);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const insertAt = insertIndexRef.current;

    // Insert placeholder image block (empty url = loading state)
    const placeholder: Block = { type: 'image', url: '', caption: '' };
    const withPlaceholder = [...blocks];
    withPlaceholder.splice(insertAt, 0, placeholder);
    onChange(withPlaceholder);
    setUploadingIndex(insertAt);

    try {
      const storageRef = ref(storage, `${storagePath}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Replace placeholder with actual image
      const updated = [...withPlaceholder];
      updated[insertAt] = { type: 'image', url, caption: '' };
      onChange(updated);
    } catch {
      // Remove placeholder on failure
      onChange(withPlaceholder.filter((_, i) => i !== insertAt));
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {blocks.map((block, index) => (
        <div key={index}>
          <div className="group relative flex items-start gap-2 py-2">
            {/* Drag handle + Delete */}
            <div className="flex flex-col items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <span className="text-warm-300">
                <GripVertical className="w-4 h-4" />
              </span>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="text-warm-300 hover:text-red-500 transition-colors cursor-pointer"
                title="블록 삭제"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block content */}
            <div className="flex-1 min-w-0">
              {block.type === 'text' && (
                <AutoResizeTextarea
                  value={block.value}
                  onChange={(value) => updateBlock(index, { type: 'text', value })}
                  placeholder="텍스트를 입력하세요..."
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-2">
                  {block.url ? (
                    <img
                      src={block.url}
                      alt={block.caption || '첨부 이미지'}
                      className="max-w-full rounded-lg border border-warm-200"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-warm-200 bg-warm-50">
                      <Loader2 className="w-6 h-6 text-warm-400 animate-spin" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={block.caption || ''}
                    onChange={(e) =>
                      updateBlock(index, { type: 'image', url: block.url, caption: e.target.value })
                    }
                    placeholder="캡션 입력 (선택)"
                    className="w-full text-sm text-warm-500 border-0 border-b border-warm-200 bg-transparent focus:outline-none focus:border-primary-400 pb-1 placeholder:text-warm-300"
                  />
                </div>
              )}

              {block.type === 'divider' && (
                <hr className="border-warm-300 my-2" />
              )}
            </div>
          </div>

          {/* Add block bar between blocks */}
          <AddBlockBar onAdd={(type) => insertBlock(index, type)} />
        </div>
      ))}

      {blocks.length === 0 && (
        <AddBlockBar onAdd={(type) => insertBlock(-1, type)} />
      )}

      {uploadingIndex !== null && (
        <p className="text-xs text-warm-400 text-center py-1">이미지 업로드 중...</p>
      )}
    </div>
  );
}
