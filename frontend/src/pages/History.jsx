import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, Search, Filter, Trash2, ChevronRight, ChevronLeft, 
  UploadCloud, ArrowRight, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const navigate = useNavigate();

  // Logs state
  const [historyItems, setHistoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Default limit as shown in mockup rows

  const categories = [
    'All',
    'Fauna (Animals)',
    'Flora (Plants)',
    'Transportation',
    'Technology & Objects',
    'Food & Culinary',
    'General'
  ];

  // Load history from LocalStorage
  const loadHistory = () => {
    const logs = JSON.parse(localStorage.getItem('deepnet_history_logs') || '[]');
    setHistoryItems(logs);
    setFilteredItems(logs);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Filter logs when search or category selection changes
  useEffect(() => {
    let result = [...historyItems];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.predictionLabel.toLowerCase().includes(q) ||
        (item.geminiAnalysis?.category || '').toLowerCase().includes(q) ||
        (item.geminiAnalysis?.summary || '').toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      result = result.filter(item => 
        (item.geminiAnalysis?.category || '').toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredItems(result);
    setCurrentPage(1); // Reset to page 1 on filter
  }, [searchQuery, categoryFilter, historyItems]);

  // Delete a history record
  const handleDeleteItem = (id, e) => {
    e.stopPropagation(); // Avoid cell click triggers
    if (!window.confirm('Are you sure you want to delete this scan from history?')) return;

    const history = JSON.parse(localStorage.getItem('deepnet_history_logs') || '[]');
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem('deepnet_history_logs', JSON.stringify(filtered));
    
    toast.success('Scan record deleted');
    loadHistory();
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 custom-scrollbar">
      <div className="mx-auto max-w-5xl">
        
        {/* Title Info */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-indigo-950 md:text-3xl">
              Analysis History
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Review all past image scans, detailed cloud insights, and print PDF laboratory reports.
            </p>
          </div>
          <div>
            <Link
              to="/upload"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
            >
              Scan New Image
            </Link>
          </div>
        </div>

        {/* Outer Panel Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md flex flex-col min-h-[580px] justify-between">
          <div>
            
            {/* Header Title */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" /> History Dashboard
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                {filteredItems.length} Scans Found
              </span>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="relative sm:col-span-7">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search history..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-slate-50/20"
                />
              </div>
              <div className="relative sm:col-span-5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Filter className="h-4 w-4" />
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-8 text-xs text-slate-600 outline-none focus:border-indigo-500 bg-white cursor-pointer font-semibold"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table / List logs */}
            {currentRecords.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-sm font-bold text-slate-800">
                  No scan records found
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Try typing different keywords, changing filters, or upload your first image.
                </p>
                <Link
                  to="/upload"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all"
                >
                  Scan first image <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-2">Image</th>
                      <th className="pb-3">Prediction</th>
                      <th className="pb-3">Confidence</th>
                      <th className="pb-3">Date Stamp</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50/50">
                    {currentRecords.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => navigate(`/result/${item.id}`)}
                        className="group cursor-pointer transition-all hover:bg-indigo-50/20"
                      >
                        <td className="py-3 pl-2">
                          <div className="h-11 w-11 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt="scan thumb"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="capitalize text-xs font-bold text-slate-800 block">
                            {item.predictionLabel}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-500/80 uppercase flex items-center gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" /> {item.geminiAnalysis?.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                            {item.confidenceScore}%
                          </span>
                        </td>
                        <td className="py-3 text-[10px] font-semibold text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleDeleteItem(item.id, e)}
                              className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete from history"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="rounded-lg p-1.5 text-indigo-600 bg-indigo-50 border border-indigo-100 opacity-85 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                              <ChevronRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 pt-5 mt-4 flex items-center justify-between text-xs font-bold">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`h-8 w-8 rounded-lg transition-all ${
                      currentPage === pNum
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default History;
