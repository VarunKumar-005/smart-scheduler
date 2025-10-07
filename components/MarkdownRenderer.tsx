
import React from 'react';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

const markdownToHtml = (text: string): string => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); 

  const lines = html.split('\n');
  let inList: 'ul' | 'ol' | null = null;
  const processedLines = [];

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (inList) {
        processedLines.push(`</${inList}>`);
        inList = null;
      }
      processedLines.push(`<h3 class="text-xl font-bold font-poppins mt-4 mb-2">${line.substring(4)}</h3>`);
    } else if (line.startsWith('## ')) {
      if (inList) {
        processedLines.push(`</${inList}>`);
        inList = null;
      }
      processedLines.push(`<h2 class="text-2xl font-bold font-poppins mt-6 mb-3">${line.substring(3)}</h2>`);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (inList !== 'ul') {
        if (inList) processedLines.push(`</${inList}>`);
        processedLines.push('<ul>');
        inList = 'ul';
      }
      processedLines.push(`<li>${line.substring(2)}</li>`);
    } else if (line.match(/^\d+\.\s/)) {
      if (inList !== 'ol') {
        if (inList) processedLines.push(`</${inList}>`);
        processedLines.push('<ol>');
        inList = 'ol';
      }
      processedLines.push(`<li>${line.replace(/^\d+\.\s/, '')}</li>`);
    } else {
      if (inList) {
        processedLines.push(`</${inList}>`);
        inList = null;
      }
      if (line.trim() !== '') {
        processedLines.push(`<p>${line}</p>`);
      }
    }
  }

  if (inList) {
    processedLines.push(`</${inList}>`);
  }

  return processedLines.join('');
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, className }) => {
  const html = markdownToHtml(text);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
