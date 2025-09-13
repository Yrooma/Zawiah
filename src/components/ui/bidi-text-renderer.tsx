import React from 'react';

interface BiDiTextRendererProps {
  text: string;
  className?: string;
}

// Regular expression to detect if a string contains Arabic characters
const arabicRegex = /[\u0600-\u06FF]/;

const BiDiTextRenderer: React.FC<BiDiTextRendererProps> = ({ text, className }) => {
  if (!text) {
    return null;
  }

  const paragraphs = text.split('\n');

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => {
        const direction = arabicRegex.test(paragraph) ? 'rtl' : 'ltr';
        const textAlign = direction === 'rtl' ? 'right' : 'left';
        return (
          <p
            key={index}
            dir={direction}
            style={{ textAlign }}
            className="whitespace-pre-wrap"
          >
            {paragraph || '\u00A0'}{/* Render a non-breaking space for empty lines */}
          </p>
        );
      })}
    </div>
  );
};

export default BiDiTextRenderer;
