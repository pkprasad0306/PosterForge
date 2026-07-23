'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Clipboard, RefreshCw, AlertCircle } from 'lucide-react';
import { ImageMetaData } from '@/lib/types';

interface DropzoneProps {
  imageMeta: ImageMetaData | null;
  onImageSelected: (meta: ImageMetaData) => void;
  onClearImage?: () => void;
}

export default function Dropzone({ imageMeta, onImageSelected, onClearImage }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Unsupported format. Please upload PNG, JPG, JPEG, or WEBP images.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;

      let sizeFormatted = `${(file.size / 1024).toFixed(1)} KB`;
      if (file.size >= 1024 * 1024) {
        sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      onImageSelected({
        name: file.name,
        width,
        height,
        aspectRatio,
        fileSizeFormatted: sizeFormatted,
        type: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
        dataUrl: objectUrl,
      });
    };
    img.onerror = () => {
      setErrorMsg('Failed to load image. File may be corrupted.');
    };
    img.src = objectUrl;
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (imageMeta) {
    return (
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-md transition-all bg-white/90">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Thumbnail preview */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center group shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageMeta.dataUrl} 
              alt={imageMeta.name} 
              className="w-full h-full object-contain p-1"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-medium text-white transition-opacity gap-1"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Change Image</span>
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 w-full space-y-2 text-left">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]" title={imageMeta.name}>
                {imageMeta.name}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {imageMeta.type}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-medium">Dimensions</span>
                <span className="font-semibold text-slate-800">{imageMeta.width} × {imageMeta.height} px</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-medium">File Size</span>
                <span className="font-semibold text-slate-800">{imageMeta.fileSizeFormatted}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-medium">Aspect Ratio</span>
                <span className="font-semibold text-slate-800">{imageMeta.aspectRatio.toFixed(2)}:1</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Select Different Image
              </button>
              {onClearImage && (
                <button
                  onClick={onClearImage}
                  className="text-xs text-slate-400 hover:text-red-600 font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden" 
          onChange={handleFileInputChange}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 scale-[1.01] shadow-lg'
            : 'border-slate-300 hover:border-blue-400 bg-white/70 hover:bg-white shadow-sm'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 border border-blue-200 flex items-center justify-center shadow-md shadow-blue-500/05">
            <Upload className="w-8 h-8 text-blue-600 animate-pulse-subtle" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Drag & Drop your image here
            </h3>
            <p className="text-sm text-slate-600">
              or <span className="text-blue-600 font-semibold underline underline-offset-4">browse files</span> from your computer or phone
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-medium">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> PNG, JPG, WEBP
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-medium">
              <Clipboard className="w-3.5 h-3.5 text-indigo-600" /> Paste from Clipboard (Ctrl+V)
            </span>
          </div>
        </div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden" 
          onChange={handleFileInputChange}
        />
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
