import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopPredictionsChart from '../components/TopPredictionsChart';
import {
  Sparkles, Image, CheckCircle2, ChevronLeft, Share2,
  Download, RefreshCw, Layers, Calendar, Palette, FileText, Compass, List
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  // Load record on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('deepnet_history_logs') || '[]');
    const foundRecord = history.find(r => r.id === id);

    if (foundRecord) {
      setRecord(foundRecord);

      // Celebrate with confetti on load!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      toast.error('Analysis record not found');
      navigate('/history');
    }
  }, [id, navigate]);

  // Share Results summary to clipboard
  const handleShare = () => {
    if (!record) return;

    const shareText = `AI image Classifier CLASSIFICATION REPORT
-----------------------------------------
Primary Prediction : ${record.predictionLabel}
Confidence Score   : ${record.confidenceScore}%
Category Tag       : ${record.geminiAnalysis?.category || 'General'}
Date of Analysis   : ${new Date(record.createdAt).toLocaleString()}
-----------------------------------------
SUMMARY DETAILS:
${record.geminiAnalysis?.summary || 'N/A'}
-----------------------------------------`;

    navigator.clipboard.writeText(shareText);
    toast.success('Classification report copied to clipboard!');
  };

  // Generate beautiful printable PDF laboratory report sheet
  const handleDownloadReport = () => {
    if (!record) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>AI Lab Report - ${record.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@600;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; color: #1e293b; margin: 40px; line-height: 1.5; }
            .header { border-bottom: 3px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .meta-item { font-size: 13px; }
            .meta-label { font-weight: 600; color: #64748b; font-size: 10px; text-transform: uppercase; }
            .content-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; margin-bottom: 25px; }
            .img-box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 6px; display: flex; justify-content: center; background: #fff; }
            .img-box img { max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }
            .res-card { background: #f1f5f9; border-radius: 12px; padding: 20px; border: 1px solid #cbd5e1; }
            .badge { display: inline-block; background: #dcfce7; color: #15803d; font-weight: 600; font-size: 11px; padding: 3px 8px; border-radius: 9999px; margin-bottom: 8px; }
            .primary-label { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #1e1b4b; margin: 0; text-transform: capitalize; }
            .pct { font-size: 20px; font-weight: 700; color: #4f46e5; margin-top: 4px; }
            .section-title { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 750; text-transform: uppercase; color: #475569; margin-top: 25px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            .tag { display: inline-block; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 8px; font-size: 12px; margin-right: 6px; margin-bottom: 6px; font-weight: 500; }
            .desc { font-size: 13.5px; color: #334155; text-align: justify; margin-bottom: 15px; }
            .footer { margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 15px; text-align: center; font-size: 10px; color: #94a3b8; }
            @media print { .no-print { display: none; } }
            .btn-print { background: #4f46e5; color: white; padding: 10px 18px; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;" class="no-print">
            <button onclick="window.print()" class="btn-print">Print / Save as PDF</button>
          </div>
          
          <div class="header">
            <div>
              <h1 class="title"AI image Classifier Vision Report</h1>
              <div style="font-size: 11px; color:#64748b;">BCA Major Project Image Classification Laboratory Sheet</div>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <div style="font-weight: 700; color: #4f46e5;">Hybrid AI Core</div>
              <div style="color: #64748b;">Scan Reference: ${record.id}</div>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item"><div class="meta-label">Date stamp</div><div>${new Date(record.createdAt).toLocaleString()}</div></div>
            <div class="meta-item"><div class="meta-label">Category Taxonomy</div><div>${record.geminiAnalysis?.category || 'General'}</div></div>
          </div>

          <div class="content-grid">
            <div class="img-box"><img src="${record.image}" /></div>
            <div class="res-card">
              <span class="badge">Scan Completed</span>
              <h2 class="primary-label">${record.predictionLabel}</h2>
              <div class="pct">${record.confidenceScore}% <span style="font-size: 11px; color: #64748b; font-weight: 500;">local MobileNet confidence</span></div>
            </div>
          </div>

          <h3 class="section-title">Google Gemini Multimodal Description</h3>
          <div class="desc">${record.geminiAnalysis?.fullDescription || 'No description available.'}</div>

          <h3 class="section-title">Detected Visible Elements</h3>
          <div>
            ${(record.geminiAnalysis?.objectsVisible || []).map(obj => `<span class="tag">${obj}</span>`).join('')}
          </div>

          <h3 class="section-title">Background & Scene details</h3>
          <div class="desc">${record.geminiAnalysis?.scene || 'No background details.'}</div>

          <h3 class="section-title">OCR Text Recognized</h3>
          <div class="desc" style="background:#f8fafc; padding:10px; border-radius:6px; font-family:monospace; border:1px solid #e2e8f0;">
            ${record.geminiAnalysis?.textVisible || 'No readable text discovered.'}
          </div>

          <div class="footer">
            Generated via DeepNet's hybrid TensorFlow Edge & Cloud Gemini Vision pipeline. Approved for BCA project archives.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!record) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 custom-scrollbar">
      <div className="mx-auto max-w-6xl">

        {/* Navigation links */}
        <div className="mb-6">
          <Link
            to="/upload"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" /> Back to classifier
          </Link>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN: Local MobileNet Edge Data */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Image className="h-4 w-4 text-indigo-500" /> Scanned Image Frame
              </h3>

              {/* Preview image */}
              <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner group">
                <img
                  src={record.image}
                  alt="Scanned frame preview"
                  className="max-h-[280px] w-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-3 right-3 rounded-full bg-indigo-600/90 text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm shadow-sm">
                  <Sparkles className="h-2.5 w-2.5 animate-pulse" /> Uploaded Image
                </div>
              </div>

              {/* MobileNet Result Banner */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">MobileNet Label</span>
                  <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="capitalize font-display text-2xl font-extrabold text-indigo-950">
                    {record.predictionLabel}
                  </h3>
                  <div className="text-right">
                    <span className="font-display text-2xl font-extrabold text-indigo-600 block leading-tight">
                      {record.confidenceScore}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Confidence Score</span>
                  </div>
                </div>
              </div>

              {/* Progress bars charts */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <TopPredictionsChart predictions={record.topPredictions} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Google Gemini Vision Cloud Insights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-6">

              {/* Cloud Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />  Vision Insights
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Cloud multimodal analysis from Google Gemini
                  </p>
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-100 uppercase tracking-wide">
                  {record.geminiAnalysis?.category || 'General'}
                </span>
              </div>

              {/* Gemini Summary Card Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-indigo-50/30 border border-indigo-100 p-5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 pl-0.5">One-Sentence Summary</span>
                <h4 className="mt-1 font-display text-base font-bold text-indigo-950 leading-snug">
                  "{record.geminiAnalysis?.summary || 'No summary available.'}"
                </h4>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-0.5">
                  <FileText className="h-4 w-4 text-slate-400" /> Full Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-justify bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  {record.geminiAnalysis?.fullDescription || 'No description available.'}
                </p>
              </div>

              {/* Visible Objects Tag Chips */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-0.5">
                  <List className="h-4 w-4 text-slate-400" /> Objects Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(record.geminiAnalysis?.objectsVisible || []).map((obj, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-slate-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-indigo-200 transition-colors capitalize"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background and Scene */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-0.5">
                  <Compass className="h-4 w-4 text-slate-400" /> Background / Scene Environment
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-justify bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  {record.geminiAnalysis?.scene || 'No scene details.'}
                </p>
              </div>

              {/* Color Palette Circular Chips */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-0.5">
                  <Palette className="h-4 w-4 text-slate-400" /> Color Palette Detected
                </h4>
                <div className="flex flex-wrap gap-4">
                  {(record.geminiAnalysis?.colors || []).map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full border border-slate-200 shadow-inner"
                        style={{
                          backgroundColor: color.toLowerCase().replace(/[^a-z0-9#]/g, '') // sanitize for valid colors
                        }}
                        title={color}
                      ></div>
                      <span className="text-xs font-semibold text-slate-600 capitalize">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OCR Text Visible in Image */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-0.5">
                  <FileText className="h-4 w-4 text-slate-400" /> Recognized OCR text
                </h4>
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-indigo-300">
                  {record.geminiAnalysis?.textVisible || 'No text recognized.'}
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 px-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors hover:border-slate-300"
                >
                  <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share Result</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 px-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors hover:border-slate-300"
                >
                  <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => navigate('/upload')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/50 py-3 px-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Analyze Another</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Result;
