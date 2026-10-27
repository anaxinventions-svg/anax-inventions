const mongoose = require('mongoose');

const serviceTextSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    default: '#cc7722',
    trim: true,
  },
}, { _id: false });

const heroContentSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'Premium Digital Agency',
  },
  headingLine1: {
    type: String,
    default: 'We Craft',
  },
  headingLine2: {
    type: String,
    default: 'Digital Products',
  },
  headingLine3: {
    type: String,
    default: 'That Win',
  },
  description: {
    type: String,
    default: 'A full-service digital agency specializing in MERN stack development, stunning UI/UX design, and scalable solutions.',
  },
  button1Text: {
    type: String,
    default: 'Start a Project',
  },
  button1Link: {
    type: String,
    default: '/contact',
  },
  button2Text: {
    type: String,
    default: 'View Portfolio',
  },
  button2Link: {
    type: String,
    default: '/portfolio',
  },
  serviceTexts: {
    type: [serviceTextSchema],
    default: [
      { text: 'Web Development', color: '#cc7722' },
      { text: 'UI/UX Design', color: '#cc7722' },
      { text: 'Digital Marketing', color: '#cc7722' },
      { text: 'E-Commerce Solutions', color: '#cc7722' },
      { text: 'App Development', color: '#cc7722' },
      { text: 'Customer Support', color: '#cc7722' },
    ],
  },
  rotationInterval: {
    type: Number,
    default: 4000,
    min: 1000,
    max: 10000,
  },
}, { timestamps: true });

module.exports = mongoose.model('HeroContent', heroContentSchema);