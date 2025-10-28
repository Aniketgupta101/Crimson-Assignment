"use client";
import React, { useState, useEffect } from "react";
import { ResearchPaperCard } from "../ui/Card";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ResearchPaper } from "../../types";
import { exportToCSV, exportToPDF } from "../../utils/export";

const DataDisplay: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "impact" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [allResearchPapers, setAllResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, sortOrder, itemsPerPage]);

  const filteredPapers = allResearchPapers.filter(paper => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return paper.papertitle?.toLowerCase().includes(searchLower) ||
           paper.coauthors?.toLowerCase().includes(searchLower) ||
           paper.journal?.title?.toLowerCase().includes(searchLower) ||
           paper.publishername?.toLowerCase().includes(searchLower) ||
           paper.salevelone?.name?.toLowerCase().includes(searchLower);
  });

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "date":
        comparison = new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        break;
      case "impact":
        comparison = a.journal.impactfactor - b.journal.impactfactor;
        break;
      case "title":
        comparison = a.papertitle.localeCompare(b.papertitle);
        break;
      default:
        return 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResearchPapers = sortedPapers.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://easydash.enago.com/acceptedpapers", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
        setAllResearchPapers(data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://easydash.enago.com/acceptedpapers", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
      setAllResearchPapers(data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Refresh Error:", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="error-title">Couldn&apos;t load papers</h2>
        <p className="error-message">{error}</p>
        <Button onClick={handleRefresh} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="search-section">
        <div className="search-header">
          <h1>Crimson Interactive Assessment</h1>
          <p>Research Publications</p>
        </div>

        <div className="search-controls">
          <div className="search-input">
            <label htmlFor="search-input" className="sr-only">
              Search papers, authors, or journals
            </label>
            <div className="search-input-wrapper">
            <input
                id="search-input"
              type="text"
                placeholder="Search papers, authors, or journals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search papers, authors, or journals"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="filter-controls">
            <label htmlFor="sort-select" className="sr-only">
              Sort papers by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "impact" | "title")}
              aria-label="Sort papers by"
            >
              <option value="date">Sort by Date</option>
              <option value="impact">Sort by Impact Factor</option>
              <option value="title">Sort by Title</option>
            </select>
            
            <label htmlFor="order-select" className="sr-only">
              Sort order
            </label>
            <select
              id="order-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              aria-label="Sort order"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="search-footer">
          <div className="results-info">
            {sortedPapers.length} papers found
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </div>
          <div className="export-controls">
            <div className="items-per-page">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="export-buttons">
              <button
                onClick={() => exportToCSV(sortedPapers)}
                className="csv-btn"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportToPDF(sortedPapers)}
                className="pdf-btn"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      {currentResearchPapers && currentResearchPapers.length > 0 ? (
        <div className="research-papers-grid" role="list" aria-label="Research papers list">
          {currentResearchPapers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="cursor-pointer"
              role="listitem"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setSelectedPaper(paper)}
              aria-label={`View details for paper: ${paper.papertitle}`}
            >
              <ResearchPaperCard
                paper={paper}
                className="mb-6 hover:shadow-lg transition-shadow duration-200"
              />
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No research papers found</p>
        </div>
      ) : null}

       {sortedPapers.length > 0 && (
         <div className="pagination-bottom">
           <div className="flex justify-center items-center gap-4">
             <div className="pagination-info">
               <span className="text-sm text-gray-600">
                 Showing {startIndex + 1}-
                 {Math.min(endIndex, sortedPapers.length)} of{" "}
                 {sortedPapers.length} papers
               </span>
             </div>
             <div className="pagination-controls" role="navigation" aria-label="Pagination">
               <div className="pagination-numbers" role="group" aria-label="Page numbers">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                     (pageNum) => (
                       <button
                         key={pageNum}
                         onClick={() => setCurrentPage(pageNum)}
                         className={`pagination-number ${
                           currentPage === pageNum
                             ? "pagination-number--active"
                             : ""
                         }`}
                       aria-label={`Go to page ${pageNum}`}
                       aria-current={currentPage === pageNum ? "page" : undefined}
                       >
                         {pageNum}
                       </button>
                   )
                 )}
               </div>
               
             </div>
           </div>
         </div>
       )}

      {selectedPaper && (
        <div className="modal-overlay" onClick={() => setSelectedPaper(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Paper Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedPaper(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="paper-details">
                <div className="detail-section">
                    <h3 className="detail-label">Title</h3>
                  <p className="detail-value detail-value--title">
                    {selectedPaper.papertitle}
                  </p>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Authors</h3>
                  <p className="detail-value">{selectedPaper.coauthors}</p>
                    {selectedPaper.authors && selectedPaper.authors.length > 0 && (
                      <div className="authors-detailed">
                        {selectedPaper.authors.map((author, index) => (
                          <div key={index} className="author-item">
                            <p className="detail-value detail-value--secondary">
                              <strong>{author.name}</strong>
                              {author.affiliation && ` - ${author.affiliation}`}
                              {author.email && ` (${author.email})`}
                              {author.orcid && ` - ORCID: ${author.orcid}`}
                              {author.is_corresponding && " (Corresponding Author)"}
                            </p>
                          </div>
                        ))}
                </div>
                    )}
                  </div>

                <div className="detail-section">
                      <h3 className="detail-label">Journal</h3>
                    <p className="detail-value detail-value--title">
                      {selectedPaper.journal.title}
                    </p>
                    {selectedPaper.journal.journalabbreviation && (
                      <p className="detail-value detail-value--secondary">
                        {selectedPaper.journal.journalabbreviation}
                      </p>
                    )}
                    {selectedPaper.journal.issn && (
                      <p className="detail-value detail-value--secondary">
                        ISSN: {selectedPaper.journal.issn}
                      </p>
                    )}
                      {selectedPaper.journal.eissn && (
                      <p className="detail-value detail-value--secondary">
                          E-ISSN: {selectedPaper.journal.eissn}
                      </p>
                    )}
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Impact Factor</h3>
                  <p className="detail-value">{selectedPaper.journal.impactfactor}</p>
                </div>

                {(selectedPaper.journal.country || selectedPaper.journal.quartile || selectedPaper.journal.acceptance_rate || selectedPaper.citation_count || selectedPaper.download_count || selectedPaper.view_count) && (
                  <div className="detail-section">
                    <h3 className="detail-label">Additional Metrics</h3>
                  <div className="metrics-grid">
                      {selectedPaper.journal.country && (
                        <div className="metric-item">
                          <span className="metric-label">Country</span>
                          <span className="metric-value">
                            {selectedPaper.journal.country}
                          </span>
                        </div>
                      )}
                      {selectedPaper.journal.quartile && (
                    <div className="metric-item">
                          <span className="metric-label">Quartile</span>
                          <span className="metric-value">
                            {selectedPaper.journal.quartile}
                      </span>
                    </div>
                      )}
                      {selectedPaper.journal.acceptance_rate && (
                      <div className="metric-item">
                          <span className="metric-label">Acceptance Rate</span>
                        <span className="metric-value">
                            {selectedPaper.journal.acceptance_rate}%
                        </span>
                      </div>
                    )}
                      {selectedPaper.citation_count && (
                      <div className="metric-item">
                          <span className="metric-label">Citations</span>
                        <span className="metric-value">
                            {selectedPaper.citation_count}
                        </span>
                      </div>
                    )}
                      {selectedPaper.download_count && (
                      <div className="metric-item">
                          <span className="metric-label">Downloads</span>
                        <span className="metric-value">
                            {selectedPaper.download_count}
                        </span>
                      </div>
                    )}
                      {selectedPaper.view_count && (
                      <div className="metric-item">
                          <span className="metric-label">Views</span>
                        <span className="metric-value">
                            {selectedPaper.view_count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                )}

                <div className="detail-section">
                  <h3 className="detail-label">Subject Area</h3>
                  <p className="detail-value">{selectedPaper.salevelone.name}</p>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Publisher</h3>
                  <p className="detail-value">{selectedPaper.publishername}</p>
                </div>

                <div className="detail-section">
                      <h3 className="detail-label">Service</h3>
                  <p className="detail-value">
                    {selectedPaper.servicetype.servicename}
                  </p>
                      {selectedPaper.servicetype.description && (
                    <p className="detail-value detail-value--secondary">
                          {selectedPaper.servicetype.description}
                    </p>
                  )}
                </div>

                  <div className="detail-section">
                      <h3 className="detail-label">Published</h3>
                      <p className="detail-value">
                        {new Date(selectedPaper.published_at).toLocaleDateString()}
                      </p>
                        <p className="detail-value detail-value--secondary">
                        {new Date(selectedPaper.published_at).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    {selectedPaper.doi && (
                      <div className="detail-section">
                        <h3 className="detail-label">DOI</h3>
                        <p className="detail-value detail-value--link">
                          {selectedPaper.doi}
                        </p>
                      </div>
                    )}

                    {selectedPaper.abstract && (
                      <div className="detail-section">
                        <h3 className="detail-label">Abstract</h3>
                        <p className="detail-value">
                          {selectedPaper.abstract}
                        </p>
                      </div>
                    )}

                    {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
                      <div className="detail-section">
                        <h3 className="detail-label">Keywords</h3>
                        <p className="detail-value">
                          {selectedPaper.keywords.join(', ')}
                        </p>
                      </div>
                    )}

                    {selectedPaper.volume && (
                      <div className="detail-section">
                        <h3 className="detail-label">Volume & Issue</h3>
                        <p className="detail-value">
                          Volume {selectedPaper.volume}
                          {selectedPaper.issue && `, Issue ${selectedPaper.issue}`}
                          {selectedPaper.pages && `, Pages ${selectedPaper.pages}`}
                        </p>
                      </div>
                    )}

                    {selectedPaper.language && (
                      <div className="detail-section">
                        <h3 className="detail-label">Language</h3>
                        <p className="detail-value">{selectedPaper.language}</p>
                      </div>
                    )}

                    {selectedPaper.research_type && (
                      <div className="detail-section">
                        <h3 className="detail-label">Research Type</h3>
                        <p className="detail-value">{selectedPaper.research_type}</p>
                      </div>
                    )}

                    {selectedPaper.study_design && (
                      <div className="detail-section">
                        <h3 className="detail-label">Study Design</h3>
                        <p className="detail-value">{selectedPaper.study_design}</p>
                      </div>
                    )}

                    {selectedPaper.sample_size && (
                      <div className="detail-section">
                        <h3 className="detail-label">Sample Size</h3>
                        <p className="detail-value">{selectedPaper.sample_size.toLocaleString()} participants</p>
                      </div>
                    )}

                    {selectedPaper.data_collection_period && (
                      <div className="detail-section">
                        <h3 className="detail-label">Data Collection Period</h3>
                        <p className="detail-value">{selectedPaper.data_collection_period}</p>
                      </div>
                    )}

                    {selectedPaper.methodology && (
                      <div className="detail-section">
                        <h3 className="detail-label">Methodology</h3>
                        <p className="detail-value">{selectedPaper.methodology}</p>
                      </div>
                    )}

                    {selectedPaper.results && (
                      <div className="detail-section">
                        <h3 className="detail-label">Results</h3>
                        <p className="detail-value">{selectedPaper.results}</p>
                      </div>
                    )}

                    {selectedPaper.conclusions && (
                      <div className="detail-section">
                        <h3 className="detail-label">Conclusions</h3>
                        <p className="detail-value">{selectedPaper.conclusions}</p>
                      </div>
                    )}

                    {selectedPaper.limitations && (
                      <div className="detail-section">
                        <h3 className="detail-label">Limitations</h3>
                        <p className="detail-value">{selectedPaper.limitations}</p>
                      </div>
                    )}

                    {selectedPaper.future_work && (
                      <div className="detail-section">
                        <h3 className="detail-label">Future Work</h3>
                        <p className="detail-value">{selectedPaper.future_work}</p>
                      </div>
                    )}

                    {selectedPaper.funding && (
                      <div className="detail-section">
                        <h3 className="detail-label">Funding</h3>
                        <p className="detail-value">{selectedPaper.funding}</p>
                      </div>
                    )}

                    {selectedPaper.funding_sources && selectedPaper.funding_sources.length > 0 && (
                      <div className="detail-section">
                        <h3 className="detail-label">Funding Sources</h3>
                        {selectedPaper.funding_sources.map((source, index) => (
                          <p key={index} className="detail-value detail-value--secondary">
                            <strong>{source.name}</strong>
                            {source.grant_number && ` (Grant: ${source.grant_number})`}
                            {source.amount && ` - ${source.currency} ${source.amount.toLocaleString()}`}
                            {source.duration && ` (${source.duration})`}
                          </p>
                        ))}
                      </div>
                    )}

                    {selectedPaper.acknowledgments && (
                      <div className="detail-section">
                        <h3 className="detail-label">Acknowledgments</h3>
                        <p className="detail-value">{selectedPaper.acknowledgments}</p>
                      </div>
                    )}

                    {selectedPaper.author_contributions && (
                      <div className="detail-section">
                        <h3 className="detail-label">Author Contributions</h3>
                        <p className="detail-value">{selectedPaper.author_contributions}</p>
                      </div>
                    )}

                    {selectedPaper.conflicts_of_interest && (
                      <div className="detail-section">
                        <h3 className="detail-label">Conflicts of Interest</h3>
                        <p className="detail-value">{selectedPaper.conflicts_of_interest}</p>
                      </div>
                    )}

                    {selectedPaper.ethical_approval && (
                      <div className="detail-section">
                        <h3 className="detail-label">Ethical Approval</h3>
                        <p className="detail-value">{selectedPaper.ethical_approval}</p>
                      </div>
                    )}

                    {selectedPaper.data_availability && (
                      <div className="detail-section">
                        <h3 className="detail-label">Data Availability</h3>
                        <p className="detail-value">{selectedPaper.data_availability}</p>
                      </div>
                    )}

                    {selectedPaper.supplementary_materials && (
                      <div className="detail-section">
                        <h3 className="detail-label">Supplementary Materials</h3>
                        <p className="detail-value">{selectedPaper.supplementary_materials}</p>
                      </div>
                    )}

                    {selectedPaper.license && (
                      <div className="detail-section">
                        <h3 className="detail-label">License</h3>
                        <p className="detail-value">{selectedPaper.license}</p>
                      </div>
                    )}

                    {selectedPaper.open_access !== undefined && (
                      <div className="detail-section">
                        <h3 className="detail-label">Open Access</h3>
                        <p className="detail-value">{selectedPaper.open_access ? 'Yes' : 'No'}</p>
                    </div>
                    )}

                    {selectedPaper.peer_reviewed !== undefined && (
                      <div className="detail-section">
                        <h3 className="detail-label">Peer Reviewed</h3>
                        <p className="detail-value">{selectedPaper.peer_reviewed ? 'Yes' : 'No'}</p>
                  </div>
                )}

                    {selectedPaper.tags && selectedPaper.tags.length > 0 && (
                  <div className="detail-section">
                        <h3 className="detail-label">Tags</h3>
                    <p className="detail-value">
                          {selectedPaper.tags.map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                              {index < (selectedPaper.tags?.length || 0) - 1 && ', '}
                            </span>
                          ))}
                    </p>
                  </div>
                )}

                    {selectedPaper.categories && selectedPaper.categories.length > 0 && (
                <div className="detail-section">
                        <h3 className="detail-label">Categories</h3>
                    <p className="detail-value">
                          {selectedPaper.categories.join(', ')}
                        </p>
                      </div>
                    )}

                    {selectedPaper.related_papers && selectedPaper.related_papers.length > 0 && (
                      <div className="detail-section">
                        <h3 className="detail-label">Related Papers</h3>
                        {selectedPaper.related_papers.map((paper, index) => (
                          <p key={index} className="detail-value detail-value--secondary">
                            {paper}
                          </p>
                        ))}
                      </div>
                    )}

                    {selectedPaper.references && selectedPaper.references.length > 0 && (
                      <div className="detail-section">
                        <h3 className="detail-label">References</h3>
                        <div className="references-list">
                          {selectedPaper.references.slice(0, 10).map((ref, index) => (
                            <p key={index} className="detail-value detail-value--secondary reference-item">
                              {index + 1}. {ref}
                            </p>
                          ))}
                          {selectedPaper.references.length > 10 && (
                    <p className="detail-value detail-value--secondary">
                              ... and {selectedPaper.references.length - 10} more references
                            </p>
                          )}
                  </div>
                </div>
                    )}

                {selectedPaper.articlelink && (
                  <div className="detail-section">
                    <h3 className="detail-label">Link</h3>
                    <a
                      href={selectedPaper.articlelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-value detail-value--link"
                    >
                      View Article
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
