'use client';

import React from 'react';
import { CardProps, ResearchPaper } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  image,
  actions,
  hover = true,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    hover ? 'hover:shadow-md hover:-translate-y-1' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {image && (
        <div className="card__image mb-4">
          <img
            src={image}
            alt={title || 'Card image'}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      {(title || subtitle) && (
        <div className="card__header mb-4">
          {title && (
            <h3 className="card__title text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="card__subtitle text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="card__content">
        {children}
      </div>
      
      {actions && (
        <div className="card__footer mt-4 pt-4 border-t border-gray-200">
          {actions}
        </div>
      )}
    </div>
  );
};

export const ResearchPaperCard: React.FC<{
  paper: ResearchPaper;
  className?: string;
}> = ({ paper, className = '' }) => {
  // Helper to build full image URLs
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://easydash.enago.com${imagePath}`;
  };

  return (
    <div className={`research-paper-card ${className}`}>
      <div className="research-paper-card__left">
        <div className="research-paper-card__cover">
          {paper.salevelone?.icon?.url ? (
            <div className="research-paper-card__cover-image-container">
              <img
                src={getImageUrl(paper.salevelone.icon.url)}
                alt={paper.salevelone.icon.alternativeText || 'Journal Icon'}
                className="research-paper-card__cover-image"
              />
            </div>
          ) : (
            <div className="research-paper-card__cover-placeholder">
              <div className="research-paper-card__cover-spine"></div>
              <div className="research-paper-card__cover-content">
                <div className="research-paper-card__cover-logo"></div>
                <div className="research-paper-card__cover-figure"></div>
                <div className="research-paper-card__cover-text">
                  {paper.journal.journalabbreviation?.toUpperCase() || paper.journal.title.toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="research-paper-card__impact-factor">
          IF {paper.journal.impactfactor}
        </div>
      </div>


      <div className="research-paper-card__right">
        <div className="research-paper-card__detail">
          <span className="research-paper-card__label">Paper Title:</span>
          <span className="research-paper-card__value">{paper.papertitle}</span>
        </div>
        
        <div className="research-paper-card__detail">
          <span className="research-paper-card__label">Authors:</span>
          <span className="research-paper-card__value research-paper-card__value--single-line">{paper.coauthors}</span>
        </div>
        
        <div className="research-paper-card__detail">
          <span className="research-paper-card__label">Publisher:</span>
          <span className="research-paper-card__value research-paper-card__value--single-line">{paper.publishername}</span>
        </div>
        
        <div className="research-paper-card__detail">
          <span className="research-paper-card__label">Journal:</span>
          <span className="research-paper-card__value research-paper-card__value--single-line">{paper.journal.title}</span>
        </div>
        
      </div>
    </div>
  );
};

export default Card;
