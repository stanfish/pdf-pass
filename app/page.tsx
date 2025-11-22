'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, FileText, Lock, Download, Loader2, X, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    setDownloadUrl(null);
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);

      const response = await fetch('/api/protect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to protect PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setDownloadUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-4 shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            PDF Fortress
          </h1>
          <p className="text-neutral-400 mt-2">Secure your documents entirely in your browser.</p>
        </div>

        <div className="glass-dark rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          {downloadUrl ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                <Download className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ready to Download!</h2>
              <p className="text-neutral-400 mb-8">
                Your file has been encrypted locally. It never left your device.
              </p>

              <a
                href={downloadUrl}
                download={`protected_${file?.name}`}
                className="block w-full py-4 px-6 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 mb-4"
              >
                Download Protected PDF
              </a>

              <button
                onClick={reset}
                className="text-sm text-neutral-500 hover:text-white transition-colors"
              >
                Protect another file
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div
                className={cn(
                  "relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-out",
                  isDragging
                    ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
                    : file
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-neutral-700 hover:border-neutral-500 hover:bg-white/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="application/pdf"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center">
                  {file ? (
                    <>
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 text-green-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-white truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-3 text-neutral-400 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-neutral-300">
                        Drop your PDF here
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
                    </>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400 ml-1">Set Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={cn(
                      "w-full bg-neutral-900/50 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 transition-all",
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-neutral-800 focus:ring-purple-500/50 focus:border-purple-500"
                    )}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-400 ml-1">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || !password || !confirmPassword || password !== confirmPassword || isProcessing}
                className={cn(
                  "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform duration-200 shadow-lg",
                  !file || !password || !confirmPassword || password !== confirmPassword || isProcessing
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Encrypting...
                  </span>
                ) : (
                  "Protect PDF"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-neutral-600 text-xs mt-8">
          Files are processed in memory and deleted immediately after encryption.
        </p>
      </div>
    </main>
  );
}
