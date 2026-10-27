const React = require('react');
const { Document, Page, Text, View, StyleSheet, Font } = require('@react-pdf/renderer');

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhp.woff2', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottom: '2px solid #cc7722', paddingBottom: 15, textAlign: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#1d2e2a', letterSpacing: 2, marginBottom: 5 },
  tagline: { fontSize: 10, color: '#cc7722', marginBottom: 10 },
  badge: { backgroundColor: '#cc7722', color: '#ffffff', fontSize: 10, padding: 4, borderRadius: 20, textAlign: 'center', width: 120, marginTop: 10 },
  section: { marginBottom: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1d2e2a', marginBottom: 12, borderBottom: '1px solid #e0e0e0', paddingBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid #f0f0f0' },
  label: { width: '30%', fontSize: 10, color: '#6c757d', fontWeight: 'bold' },
  value: { width: '70%', fontSize: 11, color: '#1d2e2a' },
  budgetValue: { color: '#28a745', fontSize: 14, fontWeight: 'bold' },
  scopeText: { fontSize: 11, color: '#444', lineHeight: 1.5, marginBottom: 5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', borderTop: '1px solid #e0e0e0', paddingTop: 15, fontSize: 8, color: '#adb5bd' },
  signatureSection: { flexDirection: 'row', marginTop: 40, justifyContent: 'space-between' },
  signatureBox: { width: '45%' },
  signatureLine: { borderTop: '1px solid #1d2e2a', marginTop: 40, marginBottom: 5 },
  signatureText: { fontSize: 8, color: '#6c757d', textAlign: 'center' }
});

function formatLabel(key) {
  const labels = {
    'businessPurpose': 'Business Purpose', 'targetAudience': 'Target Audience',
    'frontendTech': 'Frontend Technology', 'backendTech': 'Backend Technology',
    'database': 'Database', 'features': 'Key Features', 'responsive': 'Responsive Design',
    'platform': 'Target Platform', 'appCategory': 'App Category',
    'userAuthentication': 'User Authentication', 'paymentGateways': 'Payment Gateways',
    'shippingRequirements': 'Shipping Requirements', 'primaryGoal': 'Primary Goal',
    'platforms': 'Target Platforms', 'monthlyBudget': 'Monthly Budget',
    'designType': 'Design Type', 'numberOfScreens': 'Number of Screens'
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

const ProposalDocument = ({ data }) => {
  const proposalNumber = `ANAX-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const requirements = data.clientRequirements || {};
  const requirementsArray = Object.entries(requirements).filter(([_, value]) => value);

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.logo }, 'ANAX INVENTIONS'),
        React.createElement(Text, { style: styles.tagline }, 'Transforming Ideas into Digital Reality'),
        React.createElement(Text, { style: styles.badge }, 'OFFICIAL PROPOSAL')
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Proposal Number:'), React.createElement(Text, { style: styles.value }, proposalNumber)),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Date:'), React.createElement(Text, { style: styles.value }, currentDate)),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Valid Until:'), React.createElement(Text, { style: styles.value }, '30 days from now'))
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'CLIENT INFORMATION'),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Client Name:'), React.createElement(Text, { style: styles.value }, data.clientName || 'N/A')),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Email:'), React.createElement(Text, { style: styles.value }, data.clientEmail || 'N/A')),
        data.clientPhone ? React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Phone:'), React.createElement(Text, { style: styles.value }, data.clientPhone)) : null
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'PROJECT OVERVIEW'),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Project Title:'), React.createElement(Text, { style: styles.value }, data.projectName)),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Service Type:'), React.createElement(Text, { style: styles.value }, data.serviceTitle || 'Custom Development')),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Budget:'), React.createElement(Text, { style: styles.value }, React.createElement(Text, { style: styles.budgetValue }, `₨ ${parseInt(data.budget).toLocaleString()}`))),
        React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Timeline:'), React.createElement(Text, { style: styles.value }, data.timeline))
      ),
      requirementsArray.length > 0 ? React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'YOUR REQUIREMENTS'),
        requirementsArray.map(([key, value]) => {
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          return displayValue ? React.createElement(View, { key: key, style: styles.row }, React.createElement(Text, { style: styles.label }, `${formatLabel(key)}:`), React.createElement(Text, { style: styles.value }, displayValue)) : null;
        })
      ) : null,
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'SCOPE OF WORK'),
        React.createElement(Text, { style: styles.scopeText }, data.scope || 'As discussed in the requirements')
      ),
      data.deliverables ? React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'DELIVERABLES'),
        React.createElement(Text, { style: styles.scopeText }, data.deliverables)
      ) : null,
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'PAYMENT TERMS'),
        React.createElement(Text, { style: styles.scopeText }, '• 30% Advance - Project Initiation'),
        React.createElement(Text, { style: styles.scopeText }, '• 30% Milestone - After Design Approval'),
        React.createElement(Text, { style: styles.scopeText }, '• 40% Delivery - Final Delivery')
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'TERMS & CONDITIONS'),
        React.createElement(Text, { style: styles.scopeText }, '• This proposal is valid for 30 days from the date of issue.'),
        React.createElement(Text, { style: styles.scopeText }, '• Any changes in scope may affect the budget and timeline.'),
        React.createElement(Text, { style: styles.scopeText }, '• Source code ownership transfers upon full payment.'),
        React.createElement(Text, { style: styles.scopeText }, '• 14 days free technical support after delivery.')
      ),
      React.createElement(View, { style: styles.signatureSection },
        React.createElement(View, { style: styles.signatureBox }, React.createElement(View, { style: styles.signatureLine }), React.createElement(Text, { style: styles.signatureText }, 'For Anax Inventions')),
        React.createElement(View, { style: styles.signatureBox }, React.createElement(View, { style: styles.signatureLine }), React.createElement(Text, { style: styles.signatureText }, 'For Client'))
      ),
      data.notes ? React.createElement(Text, { style: styles.scopeText }, React.createElement(Text, { style: { fontWeight: 'bold' } }, 'Additional Notes: '), data.notes) : null,
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, null, 'Anax Inventions — UK Registered Company'),
        React.createElement(Text, null, 'Email: anaxinventions@gmail.com | Phone: +92 311 6735509'),
        React.createElement(Text, null, `© ${new Date().getFullYear()} Anax Inventions. All rights reserved.`)
      )
    )
  );
};

module.exports = ProposalDocument;