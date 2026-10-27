const React = require('react');
const { renderToBuffer } = require('@react-pdf/renderer');
const ProposalDocument = require('./proposalTemplate');

async function generateProposalPDF(proposalData) {
  try {
    const pdfBuffer = await renderToBuffer(React.createElement(ProposalDocument, { data: proposalData }));
    return pdfBuffer;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}

module.exports = generateProposalPDF;