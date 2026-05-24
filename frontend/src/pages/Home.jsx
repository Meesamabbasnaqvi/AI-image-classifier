import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowRight, ShieldCheck, Download, Sparkles, Cpu, Image, Layout } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Local Edge Classifier',
      desc: 'Runs Google MobileNet v2 neural networks locally in your browser using TensorFlow.js for sub-second, hardware-accelerated classification.',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },

    {
      title: 'Self-Contained Storage',
      desc: 'Retains all scanned history logs, tags, and base64 image data directly inside your browser using secure localStorage.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Academic Report Sheets',
      desc: 'Compiles full results into a beautifully formatted laboratory worksheet ready to be printed or saved directly as a PDF.',
      icon: Download,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
  ];

  const technologies = [
    { name: 'React.js', category: 'Frontend UI', icon: Layout },
    { name: 'Tailwind CSS', category: 'Modern Glass Styles', icon: Layout },
    { name: 'TensorFlow.js', category: 'Edge Deep Learning', icon: Cpu },
    { name: 'HTML5 localStorage', category: 'Zero-Backend Database', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 flex flex-col justify-between flex-1">
      {/* Glow Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-400/10 blur-[100px] pointer-events-none"></div>

      {/* Main Main container */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20 text-center flex-1">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            Major Project By  <a href="https://github.com/Meesamabbasnaqvi">Meesam Abbas</a>
          </span>

          {/* Heading */}
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">

            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              AI Image Classifier
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Upload images to instantly classify objects locally, then leverage AI to extract visible scenes, colors, embedded text, and detailed image insights..
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/upload"
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
            >
              Scan New Image <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/history"
              className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:-translate-y-0.5"
            >
              View Scans History
            </Link>
          </div>
        </div>

        {/* Feature section */}
        <section className="mt-24 md:mt-32 ">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl text-slate-900 font-display">
              Core Technical Features
            </h2>
            <div className="mt-1.5 h-1 w-14 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left w-full max-w-5xl mx-auto">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-slate-800">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-normal">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Architecture stacks */}
        <section className="mt-24 md:mt-32 border-t border-slate-200/50 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl text-slate-900 font-display">
              System Architecture Stacks
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Developed in compliance with advanced university project requirements.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-800">{tech.name}</h4>
                    <span className="text-[10px] font-medium text-slate-400">{tech.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/40 py-8 text-center text-xs font-semibold text-slate-400">
        <p>© 2026 AI Image Classifier.</p>
      </footer>
    </div>
  );
};

export default Home;
