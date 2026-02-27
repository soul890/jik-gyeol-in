import { useState } from 'react';
import { X } from 'lucide-react';
import type { Block } from '@/types';

interface BlockRendererProps {
  blocks?: Block[];
  content?: string;
}

export function BlockRenderer({ blocks, content }: BlockRendererProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Backwards compatibility: no blocks → render legacy content
  if (!blocks || blocks.length === 0) {
    if (!content) return null;
    return (
      <div className="prose prose-warm max-w-none">
        {content.split('\n').map((line, i) => (
          <p key={i} className="text-warm-700 leading-relaxed mb-1">
            {line || <br />}
          </p>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {blocks.map((block, index) => {
          if (block.type === 'text') {
            return (
              <div key={index}>
                {block.value.split('\n').map((line, i) => (
                  <p key={i} className="text-warm-700 leading-relaxed mb-1">
                    {line || <br />}
                  </p>
                ))}
              </div>
            );
          }

          if (block.type === 'image') {
            return (
              <figure key={index} className="my-4">
                <button
                  type="button"
                  onClick={() => setLightboxUrl(block.url)}
                  className="block w-full cursor-pointer"
                >
                  <img
                    src={block.url}
                    alt={block.caption || '첨부 이미지'}
                    className="w-full rounded-lg border border-warm-200 hover:opacity-95 transition-opacity"
                  />
                </button>
                {block.caption && (
                  <figcaption className="text-sm text-warm-400 text-center mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === 'divider') {
            return <hr key={index} className="border-warm-200 my-6" />;
          }

          return null;
        })}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="첨부 사진"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
