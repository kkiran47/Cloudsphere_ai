import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { searchFiles } from '../services/ai';
import FileCard from '../components/FileCard';
import ShareModal from '../components/ShareModal';
import OCRViewer from '../components/OCRViewer';
import { Search as SearchIcon } from 'lucide-react';
import Loading from '../components/Loading';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await searchFiles(query);
      setResults(data.data);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    }
    setIsSearching(false);
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="text-center max-w-2xl mx-auto pt-8">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchIcon size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Semantic Search</h1>
        <p className="text-slate-500 mb-8">Search for files using natural language. We search the meaning, not just the exact keywords.</p>
        
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      </div>

      <div className="flex-1 mt-8">
        {isSearching ? (
          <Loading />
        ) : hasSearched ? (
          results.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-6">Found {results.length} relevant file{results.length > 1 ? 's' : ''}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(file => (
                  <FileCard 
                    key={file._id} 
                    file={file} 
                    onDelete={() => {}} // Usually don't delete from search directly, or handle properly
                    onShare={setShareFile}
                    onView={setViewFile}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">No semantic matches found for your query.</p>
              <p className="text-sm mt-2">Try rephrasing or using different keywords.</p>
            </div>
          )
        ) : null}
      </div>

      {shareFile && (
        <ShareModal 
          isOpen={true} 
          file={shareFile} 
          onClose={() => setShareFile(null)} 
        />
      )}

      {viewFile && (
        <OCRViewer
          isOpen={true}
          file={viewFile}
          onClose={() => setViewFile(null)}
        />
      )}
    </div>
  );
};

export default Search;
