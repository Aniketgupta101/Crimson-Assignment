// Simple export functions for the papers
export const exportToCSV = (papers: any[], filename: string = 'research_papers.csv') => {
  const headers = [
    'Title',
    'Authors', 
    'Journal',
    'Impact Factor',
    'Subject Area',
    'Publisher',
    'Published Date',
    'Service Type'
  ];
  
  const csvContent = [
    headers.join(','),
    ...papers.map(paper => [
      `"${(paper.papertitle || '').replace(/"/g, '""')}"`,
      `"${(paper.coauthors || '').replace(/"/g, '""')}"`,
      `"${(paper.journal?.title || '').replace(/"/g, '""')}"`,
      paper.journal?.impactfactor || '',
      `"${(paper.salevelone?.name || '').replace(/"/g, '""')}"`,
      `"${(paper.publishername || '').replace(/"/g, '""')}"`,
      new Date(paper.published_at).toLocaleDateString(),
      `"${(paper.servicetype?.servicename || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (papers: any[], filename: string = 'research_papers.pdf') => {
  // Use browser print for PDF - simple but works
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Research Papers Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .paper { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; }
        .title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .authors { color: #666; margin-bottom: 5px; }
        .journal { color: #333; margin-bottom: 5px; }
        .impact { color: #0070f3; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Research Papers Export</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      ${papers.map(paper => `
        <div class="paper">
          <div class="title">${paper.papertitle || 'N/A'}</div>
          <div class="authors">${paper.coauthors || 'N/A'}</div>
          <div class="journal">${paper.journal?.title || 'N/A'} - Impact Factor: <span class="impact">${paper.journal?.impactfactor || 'N/A'}</span></div>
          <div>Subject: ${paper.salevelone?.name || 'N/A'} | Publisher: ${paper.publishername || 'N/A'}</div>
          <div>Published: ${new Date(paper.published_at).toLocaleDateString()}</div>
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};
