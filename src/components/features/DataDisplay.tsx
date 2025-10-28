"use client";
import React, { useState, useEffect } from "react";
import { ResearchPaperCard } from "../ui/Card";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";

const DataDisplay: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const itemsPerPage = 10;

  const [allResearchPapers, setAllResearchPapers] = useState<
    Array<{
      id: number;
      papertitle: string;
      coauthors: string;
      publishername: string;
      journal: {
        title: string;
        impactfactor: number;
        journalabbreviation?: string;
      };
      published_at: string;
      servicetype: {
        servicename: string;
      };
      salevelone: {
        name: string;
      };
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(allResearchPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResearchPapers = allResearchPapers.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://easydash.enago.com/acceptedpapers"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllResearchPapers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://easydash.enago.com/acceptedpapers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllResearchPapers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="lg" text="Loading research papers..." />
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
        <h2 className="error-title">Failed to load data</h2>
        <p className="error-message">{error}</p>
        <Button onClick={handleRefresh} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Research Publications
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Academic papers and medical research publications
        </p>
        <form onSubmit={handleSearch} className="search-bar">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar__input"
            />
            <div className="search-bar__icon">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>
      {currentResearchPapers && currentResearchPapers.length > 0 ? (
        <div className="research-papers-grid">
          {currentResearchPapers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="cursor-pointer"
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

       {allResearchPapers.length > 0 && (
         <div className="pagination-bottom mt-8">
           <div className="flex justify-between items-center">
             <div className="pagination-info">
               <span className="text-sm text-gray-600">
                 Showing {startIndex + 1}-
                 {Math.min(endIndex, allResearchPapers.length)} of{" "}
                 {allResearchPapers.length} papers
               </span>
             </div>
             <div className="pagination-controls">
               <div className="pagination-numbers">
                 {totalPages <= 10 ? (
                   Array.from({ length: totalPages }, (_, i) => i + 1).map(
                     (pageNum) => (
                       <button
                         key={pageNum}
                         onClick={() => setCurrentPage(pageNum)}
                         className={`pagination-number ${
                           currentPage === pageNum
                             ? "pagination-number--active"
                             : ""
                         }`}
                       >
                         {pageNum}
                       </button>
                     )
                   )
                 ) : (
                   <>
                     <button
                       onClick={() => setCurrentPage(1)}
                       className={`pagination-number ${
                         currentPage === 1 ? "pagination-number--active" : ""
                       }`}
                     >
                       1
                     </button>

                     {currentPage > 4 && (
                       <span className="pagination-ellipsis">...</span>
                     )}

                     {Array.from({ length: 5 }, (_, i) => {
                       const pageNum = currentPage - 2 + i;
                       if (pageNum > 1 && pageNum < totalPages) {
                         return (
                           <button
                             key={pageNum}
                             onClick={() => setCurrentPage(pageNum)}
                             className={`pagination-number ${
                               currentPage === pageNum
                                 ? "pagination-number--active"
                                 : ""
                             }`}
                           >
                             {pageNum}
                           </button>
                         );
                       }
                       return null;
                     })}

                     {currentPage < totalPages - 3 && (
                       <span className="pagination-ellipsis">...</span>
                     )}

                     <button
                       onClick={() => setCurrentPage(totalPages)}
                       className={`pagination-number ${
                         currentPage === totalPages
                           ? "pagination-number--active"
                           : ""
                       }`}
                     >
                       {totalPages}
                     </button>
                   </>
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
              <h2 className="modal-title">Research Paper Details</h2>
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
                  <h3 className="detail-label">Paper Title</h3>
                  <p className="detail-value detail-value--title">
                    {selectedPaper.papertitle}
                  </p>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Authors</h3>
                  <p className="detail-value">{selectedPaper.coauthors}</p>
                </div>

                {selectedPaper.articlelink && (
                  <div className="detail-section">
                    <h3 className="detail-label">Article Link</h3>
                    <a
                      href={selectedPaper.articlelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-value detail-value--link"
                    >
                      {selectedPaper.articlelink}
                    </a>
                  </div>
                )}

                <div className="detail-section">
                  <h3 className="detail-label">Journal Information</h3>
                  <div className="journal-info">
                    <p className="detail-value detail-value--title">
                      {selectedPaper.journal.title}
                    </p>
                    {selectedPaper.journal.journalabbreviation && (
                      <p className="detail-value detail-value--secondary">
                        Abbreviation:{" "}
                        {selectedPaper.journal.journalabbreviation}
                      </p>
                    )}
                    {selectedPaper.journal.issn && (
                      <p className="detail-value detail-value--secondary">
                        ISSN: {selectedPaper.journal.issn}
                      </p>
                    )}
                    {selectedPaper.journal.publishingcompany && (
                      <p className="detail-value detail-value--secondary">
                        Publishing Company:{" "}
                        {selectedPaper.journal.publishingcompany}
                      </p>
                    )}
                    {selectedPaper.journal.journalreach && (
                      <p className="detail-value detail-value--secondary">
                        Reach: {selectedPaper.journal.journalreach}
                      </p>
                    )}
                    {selectedPaper.journal.mediumofpublication && (
                      <p className="detail-value detail-value--secondary">
                        Medium: {selectedPaper.journal.mediumofpublication}
                      </p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Journal Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <span className="metric-label">Impact Factor</span>
                      <span className="metric-value detail-value--highlight">
                        {selectedPaper.journal.impactfactor}
                      </span>
                    </div>
                    {selectedPaper.journalaltimpactfactor && (
                      <div className="metric-item">
                        <span className="metric-label">Alt Impact Factor</span>
                        <span className="metric-value">
                          {selectedPaper.journalaltimpactfactor}
                        </span>
                      </div>
                    )}
                    {selectedPaper.journal.articleinfluence && (
                      <div className="metric-item">
                        <span className="metric-label">Article Influence</span>
                        <span className="metric-value">
                          {selectedPaper.journal.articleinfluence}
                        </span>
                      </div>
                    )}
                    {selectedPaper.journal.crimsoniscore && (
                      <div className="metric-item">
                        <span className="metric-label">Crimson Score</span>
                        <span className="metric-value">
                          {selectedPaper.journal.crimsoniscore}
                        </span>
                      </div>
                    )}
                    {selectedPaper.journal.hirschindex && (
                      <div className="metric-item">
                        <span className="metric-label">H-Index</span>
                        <span className="metric-value">
                          {selectedPaper.journal.hirschindex}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Subject Areas</h3>
                  <div className="subject-areas">
                    <p className="detail-value">
                      <strong>Level 1:</strong> {selectedPaper.salevelone.name}
                    </p>
                    {selectedPaper.saleveltwo && (
                      <p className="detail-value detail-value--secondary">
                        <strong>Level 2:</strong>{" "}
                        {selectedPaper.saleveltwo.name}
                      </p>
                    )}
                    {selectedPaper.salevelthree && (
                      <p className="detail-value detail-value--secondary">
                        <strong>Level 3:</strong>{" "}
                        {selectedPaper.salevelthree.name}
                      </p>
                    )}
                    {selectedPaper.journal.journalsubjectarea && (
                      <p className="detail-value detail-value--secondary">
                        <strong>Journal Subject:</strong>{" "}
                        {selectedPaper.journal.journalsubjectarea}
                      </p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Publisher Information</h3>
                  <p className="detail-value">{selectedPaper.publishername}</p>
                  {selectedPaper.publisher && (
                    <p className="detail-value detail-value--secondary">
                      Publisher ID: {selectedPaper.publisher.publishername}
                    </p>
                  )}
                </div>

                <div className="detail-section">
                  <h3 className="detail-label">Service Information</h3>
                  <p className="detail-value">
                    {selectedPaper.servicetype.servicename}
                  </p>
                  {selectedPaper.servicetype.servicetype && (
                    <p className="detail-value detail-value--secondary">
                      Service Type: {selectedPaper.servicetype.servicetype}
                    </p>
                  )}
                </div>

                {selectedPaper.client && (
                  <div className="detail-section">
                    <h3 className="detail-label">Client Information</h3>
                    <div className="client-info">
                      <p className="detail-value">
                        <strong>Name:</strong> {selectedPaper.client.firstname}{" "}
                        {selectedPaper.client.lastname}
                      </p>
                      {selectedPaper.client.organization && (
                        <p className="detail-value detail-value--secondary">
                          <strong>Organization:</strong>{" "}
                          {selectedPaper.client.organization}
                        </p>
                      )}
                      {selectedPaper.client.memid && (
                        <p className="detail-value detail-value--secondary">
                          <strong>Member ID:</strong>{" "}
                          {selectedPaper.client.memid}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedPaper.journaldetails && (
                  <div className="detail-section">
                    <h3 className="detail-label">Journal Details</h3>
                    <p className="detail-value">
                      {selectedPaper.journaldetails}
                    </p>
                  </div>
                )}

                <div className="detail-section">
                  <h3 className="detail-label">Important Dates</h3>
                  <div className="dates-info">
                    <p className="detail-value">
                      <strong>Published:</strong>{" "}
                      {new Date(selectedPaper.published_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="detail-value detail-value--secondary">
                      <strong>Created:</strong>{" "}
                      {new Date(selectedPaper.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {selectedPaper.assignmentno && (
                  <div className="detail-section">
                    <h3 className="detail-label">Assignment Number</h3>
                    <p className="detail-value">{selectedPaper.assignmentno}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setSelectedPaper(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
