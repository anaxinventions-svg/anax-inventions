// src/components/Admin control/tabs/HomePage/iconData.js

export const iconCategories = {
  'Development': [
    { value: 'fa-globe', label: '🌐 Web Development', icon: 'fa-globe' },
    { value: 'fa-mobile-alt', label: '📱 Mobile App', icon: 'fa-mobile-alt' },
    { value: 'fa-code', label: '💻 Software', icon: 'fa-code' },
    { value: 'fa-cart-shopping', label: '🛒 E-Commerce', icon: 'fa-cart-shopping' },
    { value: 'fa-cloud', label: '☁️ Cloud', icon: 'fa-cloud' },
    { value: 'fa-laptop-code', label: '💻 Development', icon: 'fa-laptop-code' },
  ],
  'Design': [
    { value: 'fa-pen-ruler', label: '✏️ UI/UX Design', icon: 'fa-pen-ruler' },
    { value: 'fa-paintbrush', label: '🎨 Graphics Design', icon: 'fa-paintbrush' },
    { value: 'fa-palette', label: '🎨 Palette', icon: 'fa-palette' },
    { value: 'fa-trademark', label: '™️ Logo Design', icon: 'fa-trademark' },
    { value: 'fa-film', label: '🎬 Motion Graphics', icon: 'fa-film' },
    { value: 'fa-drafting-compass', label: '📐 Drafting', icon: 'fa-drafting-compass' },
  ],
  'Marketing & SEO': [
    { value: 'fa-magnifying-glass-chart', label: '🔍 SEO', icon: 'fa-magnifying-glass-chart' },
    { value: 'fa-chart-line', label: '📈 Analytics', icon: 'fa-chart-line' },
    { value: 'fa-google', label: '📊 Google Ads', icon: 'fa-google' },
    { value: 'fa-facebook', label: '📘 Facebook', icon: 'fa-facebook' },
    { value: 'fa-instagram', label: '📷 Instagram', icon: 'fa-instagram' },
    { value: 'fa-linkedin', label: '🔗 LinkedIn', icon: 'fa-linkedin' },
    { value: 'fa-share-nodes', label: '📱 Social Media', icon: 'fa-share-nodes' },
    { value: 'fa-envelope', label: '✉️ Email', icon: 'fa-envelope' },
    { value: 'fa-pen-fancy', label: '✍️ Content', icon: 'fa-pen-fancy' },
    { value: 'fa-bullhorn', label: '📢 PPC', icon: 'fa-bullhorn' },
  ],
  'AI & Technology': [
    { value: 'fa-brain', label: '🧠 AI', icon: 'fa-brain' },
    { value: 'fa-robot', label: '🤖 Chatbot', icon: 'fa-robot' },
    { value: 'fa-microchip', label: '🔬 Microchip', icon: 'fa-microchip' },
    { value: 'fa-chalkboard-user', label: '👨‍🏫 Consulting', icon: 'fa-chalkboard-user' },
    { value: 'fa-shield-haltered', label: '🛡️ Security', icon: 'fa-shield-haltered' },
  ],
  'Business & Office': [
    { value: 'fa-building', label: '🏢 Corporate', icon: 'fa-building' },
    { value: 'fa-landmark', label: '🏛️ Portfolio', icon: 'fa-landmark' },
    { value: 'fa-blog', label: '📝 Blog', icon: 'fa-blog' },
    { value: 'fa-chalkboard-user', label: '📚 LMS', icon: 'fa-chalkboard-user' },
    { value: 'fa-calendar-check', label: '📅 Booking', icon: 'fa-calendar-check' },
    { value: 'fa-store', label: '🏪 Store', icon: 'fa-store' },
  ],
  'Process Steps': [
    { value: 'fa-search', label: '🔍 Search', icon: 'fa-search' },
    { value: 'fa-paintbrush', label: '🎨 Paintbrush', icon: 'fa-paintbrush' },
    { value: 'fa-code', label: '💻 Code', icon: 'fa-code' },
    { value: 'fa-vial', label: '🧪 Test', icon: 'fa-vial' },
    { value: 'fa-rocket', label: '🚀 Launch', icon: 'fa-rocket' },
    { value: 'fa-lightbulb', label: '💡 Ideation', icon: 'fa-lightbulb' },
    { value: 'fa-cogs', label: '⚙️ Settings', icon: 'fa-cogs' },
  ],
  'Default': [
    { value: 'fa-cube', label: '📦 Other', icon: 'fa-cube' },
    { value: 'fa-folder', label: '📁 Folder', icon: 'fa-folder' },
  ]
};

export const allIcons = Object.values(iconCategories).flat();