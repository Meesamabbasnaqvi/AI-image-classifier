import React, { useState, useRef } from 'react';
import { UploadCloud, Image, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadCard = ({ onImageSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate format
    if (!file.type.startsWith('image/')) {
      toast.error('Unsupported file format. Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    // Validate size (max 8MB for stable base64 transferring in browser)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('File is too large. Please upload an image under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelected({
        file,
        base64: event.target.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
        isDragActive
          ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
          : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50/50 hover:shadow-lg'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload-input"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Circle Icon */}
      <div
        onClick={() => fileInputRef.current.click()}
        className={`mb-6 flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br transition-all duration-300 ${
          isDragActive
            ? 'from-indigo-600 to-indigo-500 text-white rotate-6'
            : 'from-slate-50 to-slate-100/50 text-slate-400 group-hover:from-indigo-50 group-hover:to-indigo-100 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-md'
        }`}
      >
        <UploadCloud className="h-10 w-10" />
      </div>

      <h3 className="font-display text-lg font-bold text-slate-800">
        Upload your analysis image
      </h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm leading-normal">
        Drag and drop your image file here, or{' '}
        <button
          onClick={() => fileInputRef.current.click()}
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          browse your files
        </button>
      </p>

      {/* Details */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-500">
          <Image className="h-3.5 w-3.5" />
          <span>PNG, JPG, WEBP</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-500">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Max 8 MB</span>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
