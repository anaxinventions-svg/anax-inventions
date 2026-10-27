// src/components/Admin control/tabs/HomePage/PageEditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import IconPicker from './IconPicker';
import './PageEditor.css';

const API_URL = 'http://localhost:5001/api';

const PageEditor = ({ pageSlug, pageName }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (pageSlug) {
      fetchPageData();
    }
  }, [pageSlug]);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pages/${pageSlug}`);
      if (response.data.success && response.data.page) {
        const fetchedData = response.data.page;
        if (!fetchedData.category) {
          fetchedData.category = 'development';
        }
        setPageData(fetchedData);
      } else {
        setPageData({
          pageSlug: pageSlug,
          pageName: pageName,
          category: 'development',
          hero: {
            tagline: '',
            title: '',
            description: '',
            primaryButtonText: 'Get Started →',
            secondaryButtonText: 'Learn More',
            backgroundImage: ''
          },
          trustBadge: { enabled: true, text: '' },
          whatWeOffer: { title: 'What We Offer', subtitle: '', items: [] },
          recentProjects: { title: 'Recent Projects', subtitle: '', projects: [] },
          process: { title: 'Our Process', subtitle: '', steps: [] },
          technologies: { title: 'Technologies We Master', subtitle: '', categories: [] },
          faq: { title: 'Frequently Asked Questions', subtitle: '', items: [] },
          cta: { title: '', subtitle: '', buttonText: 'Get a Free Quote →', buttonLink: '/contact' }
        });
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      Swal.fire('Error!', 'Failed to load page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const dataToSave = {
        ...pageData,
        category: pageData.category || 'development'
      };
      await axios.post(`${API_URL}/pages/admin/save`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Success!', 'Page saved successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error.response?.data);
      Swal.fire('Error!', error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file, folder = 'pages') => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (error) {
      Swal.fire('Error!', 'Failed to upload image', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateHeroField = (field, value) => {
    setPageData({
      ...pageData,
      hero: { ...pageData.hero, [field]: value }
    });
  };

  const addWhatWeOfferItem = () => {
    const newItem = {
      icon: 'fa-cube',
      title: 'New Service',
      order: pageData.whatWeOffer.items.length
    };
    setPageData({
      ...pageData,
      whatWeOffer: {
        ...pageData.whatWeOffer,
        items: [...pageData.whatWeOffer.items, newItem]
      }
    });
  };

  const updateWhatWeOfferItem = (index, field, value) => {
    const updatedItems = [...pageData.whatWeOffer.items];
    updatedItems[index][field] = value;
    setPageData({
      ...pageData,
      whatWeOffer: { ...pageData.whatWeOffer, items: updatedItems }
    });
  };

  const deleteWhatWeOfferItem = (index) => {
    const updatedItems = pageData.whatWeOffer.items.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      whatWeOffer: { ...pageData.whatWeOffer, items: updatedItems }
    });
  };

  const addProject = () => {
    const newProject = {
      name: 'New Project',
      category: 'Category',
      description: 'Project description',
      imageUrl: '',
      liveUrl: '',
      techStack: [],
      order: pageData.recentProjects.projects.length,
      isActive: true
    };
    setPageData({
      ...pageData,
      recentProjects: {
        ...pageData.recentProjects,
        projects: [...pageData.recentProjects.projects, newProject]
      }
    });
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...pageData.recentProjects.projects];
    if (field === 'techStack') {
      updatedProjects[index][field] = value.split(',').map(s => s.trim());
    } else {
      updatedProjects[index][field] = value;
    }
    setPageData({
      ...pageData,
      recentProjects: { ...pageData.recentProjects, projects: updatedProjects }
    });
  };

  const deleteProject = (index) => {
    const updatedProjects = pageData.recentProjects.projects.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      recentProjects: { ...pageData.recentProjects, projects: updatedProjects }
    });
  };

  const addProcessStep = () => {
    const newStep = {
      number: String(pageData.process.steps.length + 1).padStart(2, '0'),
      icon: 'search',
      title: 'New Step',
      description: '',
      order: pageData.process.steps.length
    };
    setPageData({
      ...pageData,
      process: {
        ...pageData.process,
        steps: [...pageData.process.steps, newStep]
      }
    });
  };

  const updateProcessStep = (index, field, value) => {
    const updatedSteps = [...pageData.process.steps];
    updatedSteps[index][field] = value;
    setPageData({
      ...pageData,
      process: { ...pageData.process, steps: updatedSteps }
    });
  };

  const deleteProcessStep = (index) => {
    const updatedSteps = pageData.process.steps.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      process: { ...pageData.process, steps: updatedSteps }
    });
  };

  const addTechCategory = () => {
    const newCategory = {
      name: 'New Category',
      items: [],
      order: pageData.technologies.categories.length
    };
    setPageData({
      ...pageData,
      technologies: {
        ...pageData.technologies,
        categories: [...pageData.technologies.categories, newCategory]
      }
    });
  };

  const updateTechCategory = (index, field, value) => {
    const updatedCategories = [...pageData.technologies.categories];
    if (field === 'items') {
      updatedCategories[index][field] = value.split(',').map(s => s.trim());
    } else {
      updatedCategories[index][field] = value;
    }
    setPageData({
      ...pageData,
      technologies: { ...pageData.technologies, categories: updatedCategories }
    });
  };

  const deleteTechCategory = (index) => {
    const updatedCategories = pageData.technologies.categories.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      technologies: { ...pageData.technologies, categories: updatedCategories }
    });
  };

  const addFaq = () => {
    const newFaq = {
      question: 'New Question',
      answer: 'New Answer',
      order: pageData.faq.items.length
    };
    setPageData({
      ...pageData,
      faq: {
        ...pageData.faq,
        items: [...pageData.faq.items, newFaq]
      }
    });
  };

  const updateFaq = (index, field, value) => {
    const updatedItems = [...pageData.faq.items];
    updatedItems[index][field] = value;
    setPageData({
      ...pageData,
      faq: { ...pageData.faq, items: updatedItems }
    });
  };

  const deleteFaq = (index) => {
    const updatedItems = pageData.faq.items.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      faq: { ...pageData.faq, items: updatedItems }
    });
  };

  const updateCategory = (value) => {
    setPageData({
      ...pageData,
      category: value
    });
  };

  if (loading) {
    return <div className="pe-loading">Loading page editor...</div>;
  }

  if (!pageData) {
    return <div className="pe-error">Failed to load page data</div>;
  }

  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'category', label: 'Category' },
    { id: 'trust', label: 'Trust Badge' },
    { id: 'offerings', label: 'What We Offer' },
    { id: 'projects', label: 'Recent Projects' },
    { id: 'process', label: 'Process' },
    { id: 'tech', label: 'Technologies' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'CTA Section' }
  ];

  return (
    <div className="page-editor">
      <div className="pe-header">
        <h2>Editing: {pageName}</h2>
        <button onClick={handleSave} disabled={saving} className="pe-save-btn">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="pe-tabs">
        {sections.map(section => (
          <button
            key={section.id}
            className={`pe-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="pe-content">
        {/* CATEGORY SECTION */}
        {activeSection === 'category' && (
          <div className="pe-card">
            <h3>Page Category</h3>
            <div className="pe-field">
              <label>Category (Required)</label>
              <select
                value={pageData.category || 'development'}
                onChange={(e) => updateCategory(e.target.value)}
                className="category-select"
              >
                <option value="development">Development</option>
                <option value="ai-solutions">AI Solutions</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="consulting">Consulting</option>
              </select>
              <p className="pe-hint">This determines where the page appears in the navbar</p>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="pe-card">
            <h3>Hero Section</h3>
            <div className="pe-field">
              <label>Tagline</label>
              <input
                type="text"
                value={pageData.hero?.tagline || ''}
                onChange={(e) => updateHeroField('tagline', e.target.value)}
                placeholder="e.g., Web Development"
              />
            </div>
            <div className="pe-field">
              <label>Title</label>
              <input
                type="text"
                value={pageData.hero?.title || ''}
                onChange={(e) => updateHeroField('title', e.target.value)}
                placeholder="e.g., Web Application Development Solutions"
              />
            </div>
            <div className="pe-field">
              <label>Description</label>
              <textarea
                value={pageData.hero?.description || ''}
                onChange={(e) => updateHeroField('description', e.target.value)}
                rows="4"
                placeholder="Service description..."
              />
            </div>
            <div className="pe-field">
              <label>Primary Button Text</label>
              <input
                type="text"
                value={pageData.hero?.primaryButtonText || ''}
                onChange={(e) => updateHeroField('primaryButtonText', e.target.value)}
              />
            </div>
            <div className="pe-field">
              <label>Secondary Button Text</label>
              <input
                type="text"
                value={pageData.hero?.secondaryButtonText || ''}
                onChange={(e) => updateHeroField('secondaryButtonText', e.target.value)}
              />
            </div>
            <div className="pe-field">
              <label>Background Image URL</label>
              <input
                type="text"
                value={pageData.hero?.backgroundImage || ''}
                onChange={(e) => updateHeroField('backgroundImage', e.target.value)}
                placeholder="https://..."
              />
              <div className="pe-image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files[0]) {
                      const url = await uploadImage(e.target.files[0], 'pages/hero');
                      if (url) updateHeroField('backgroundImage', url);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && <span className="pe-uploading">Uploading...</span>}
              </div>
              {pageData.hero?.backgroundImage && (
                <img src={pageData.hero.backgroundImage} alt="Preview" className="pe-image-preview" />
              )}
            </div>
          </div>
        )}

        {/* TRUST BADGE SECTION */}
        {activeSection === 'trust' && (
          <div className="pe-card">
            <h3>Trust Badge</h3>
            <div className="pe-field">
              <label>
                <input
                  type="checkbox"
                  checked={pageData.trustBadge?.enabled !== false}
                  onChange={(e) => setPageData({
                    ...pageData,
                    trustBadge: { ...pageData.trustBadge, enabled: e.target.checked }
                  })}
                />
                Enable Trust Badge
              </label>
            </div>
            <div className="pe-field">
              <label>Trust Badge Text</label>
              <input
                type="text"
                value={pageData.trustBadge?.text || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  trustBadge: { ...pageData.trustBadge, text: e.target.value }
                })}
                placeholder="e.g., Backed By Client Trust And Powered By Technology"
              />
            </div>
          </div>
        )}

        {/* WHAT WE OFFER SECTION - WITH ICON PICKER */}
        {activeSection === 'offerings' && (
          <div className="pe-card">
            <h3>What We Offer</h3>
            <div className="pe-field">
              <label>Section Title</label>
              <input
                type="text"
                value={pageData.whatWeOffer?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  whatWeOffer: { ...pageData.whatWeOffer, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={pageData.whatWeOffer?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  whatWeOffer: { ...pageData.whatWeOffer, subtitle: e.target.value }
                })}
              />
            </div>
            
            <h4>Offerings Items</h4>
            <button onClick={addWhatWeOfferItem} className="pe-add-btn">+ Add Offering</button>
            
            {pageData.whatWeOffer?.items?.map((item, idx) => (
              <div key={idx} className="pe-item-editor">
                <h5>Item {idx + 1}</h5>
                {/* ✅ ICON PICKER - Visual icon selection */}
                <IconPicker 
                  value={item.icon} 
                  onChange={(e) => updateWhatWeOfferItem(idx, 'icon', e.target.value)} 
                  label="Icon"
                />
                <div className="pe-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateWhatWeOfferItem(idx, 'title', e.target.value)}
                  />
                </div>
                <button onClick={() => deleteWhatWeOfferItem(idx)} className="pe-delete-btn">Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* RECENT PROJECTS SECTION */}
        {activeSection === 'projects' && (
          <div className="pe-card">
            <h3>Recent Projects</h3>
            <div className="pe-field">
              <label>Section Title</label>
              <input
                type="text"
                value={pageData.recentProjects?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  recentProjects: { ...pageData.recentProjects, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={pageData.recentProjects?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  recentProjects: { ...pageData.recentProjects, subtitle: e.target.value }
                })}
              />
            </div>
            
            <h4>Projects</h4>
            <button onClick={addProject} className="pe-add-btn">+ Add Project</button>
            
            {pageData.recentProjects?.projects?.map((project, idx) => (
              <div key={idx} className="pe-item-editor">
                <h5>Project {idx + 1}</h5>
                <div className="pe-field">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Category</label>
                  <input
                    type="text"
                    value={project.category}
                    onChange={(e) => updateProject(idx, 'category', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
                <div className="pe-field">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={project.imageUrl}
                    onChange={(e) => updateProject(idx, 'imageUrl', e.target.value)}
                  />
                  <div className="pe-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files[0]) {
                          const url = await uploadImage(e.target.files[0], 'pages/projects');
                          if (url) updateProject(idx, 'imageUrl', url);
                        }
                      }}
                      disabled={uploading}
                    />
                  </div>
                </div>
                <div className="pe-field">
                  <label>Live URL</label>
                  <input
                    type="text"
                    value={project.liveUrl}
                    onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={project.techStack?.join(', ')}
                    onChange={(e) => updateProject(idx, 'techStack', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={project.isActive !== false}
                      onChange={(e) => updateProject(idx, 'isActive', e.target.checked)}
                    />
                    Active (show on frontend)
                  </label>
                </div>
                <button onClick={() => deleteProject(idx)} className="pe-delete-btn">Delete Project</button>
              </div>
            ))}
          </div>
        )}

        {/* PROCESS SECTION - WITH ICON PICKER */}
        {activeSection === 'process' && (
          <div className="pe-card">
            <h3>Our Process</h3>
            <div className="pe-field">
              <label>Section Title</label>
              <input
                type="text"
                value={pageData.process?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  process: { ...pageData.process, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={pageData.process?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  process: { ...pageData.process, subtitle: e.target.value }
                })}
              />
            </div>
            
            <h4>Process Steps</h4>
            <button onClick={addProcessStep} className="pe-add-btn">+ Add Step</button>
            
            {pageData.process?.steps?.map((step, idx) => (
              <div key={idx} className="pe-item-editor">
                <h5>Step {step.number}</h5>
                <div className="pe-field">
                  <label>Number</label>
                  <input
                    type="text"
                    value={step.number}
                    onChange={(e) => updateProcessStep(idx, 'number', e.target.value)}
                  />
                </div>
                {/* ✅ ICON PICKER for process steps */}
                <IconPicker 
                  value={`fa-${step.icon}`} 
                  onChange={(e) => updateProcessStep(idx, 'icon', e.target.value.replace('fa-', ''))} 
                  label="Icon"
                />
                <div className="pe-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Description (optional)</label>
                  <textarea
                    value={step.description || ''}
                    onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                    rows="2"
                  />
                </div>
                <button onClick={() => deleteProcessStep(idx)} className="pe-delete-btn">Delete Step</button>
              </div>
            ))}
          </div>
        )}

        {/* TECHNOLOGIES SECTION */}
        {activeSection === 'tech' && (
          <div className="pe-card">
            <h3>Technologies</h3>
            <div className="pe-field">
              <label>Section Title</label>
              <input
                type="text"
                value={pageData.technologies?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  technologies: { ...pageData.technologies, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={pageData.technologies?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  technologies: { ...pageData.technologies, subtitle: e.target.value }
                })}
              />
            </div>
            
            <h4>Technology Categories</h4>
            <button onClick={addTechCategory} className="pe-add-btn">+ Add Category</button>
            
            {pageData.technologies?.categories?.map((cat, idx) => (
              <div key={idx} className="pe-item-editor">
                <h5>Category {idx + 1}</h5>
                <div className="pe-field">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => updateTechCategory(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Items (comma separated)</label>
                  <input
                    type="text"
                    value={cat.items?.join(', ')}
                    onChange={(e) => updateTechCategory(idx, 'items', e.target.value)}
                    placeholder="HTML5, CSS3, JavaScript, React.js"
                  />
                </div>
                <button onClick={() => deleteTechCategory(idx)} className="pe-delete-btn">Delete Category</button>
              </div>
            ))}
          </div>
        )}

        {/* FAQ SECTION */}
        {activeSection === 'faq' && (
          <div className="pe-card">
            <h3>FAQ</h3>
            <div className="pe-field">
              <label>Section Title</label>
              <input
                type="text"
                value={pageData.faq?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  faq: { ...pageData.faq, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={pageData.faq?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  faq: { ...pageData.faq, subtitle: e.target.value }
                })}
              />
            </div>
            
            <h4>FAQ Items</h4>
            <button onClick={addFaq} className="pe-add-btn">+ Add FAQ</button>
            
            {pageData.faq?.items?.map((faq, idx) => (
              <div key={idx} className="pe-item-editor">
                <h5>FAQ {idx + 1}</h5>
                <div className="pe-field">
                  <label>Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label>Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    rows="2"
                  />
                </div>
                <button onClick={() => deleteFaq(idx)} className="pe-delete-btn">Delete</button>
              </div>
            ))}
          </div>
        )}

        {/* CTA SECTION */}
        {activeSection === 'cta' && (
          <div className="pe-card">
            <h3>CTA Section</h3>
            <div className="pe-field">
              <label>Title</label>
              <input
                type="text"
                value={pageData.cta?.title || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  cta: { ...pageData.cta, title: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Subtitle</label>
              <input
                type="text"
                value={pageData.cta?.subtitle || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  cta: { ...pageData.cta, subtitle: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Button Text</label>
              <input
                type="text"
                value={pageData.cta?.buttonText || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  cta: { ...pageData.cta, buttonText: e.target.value }
                })}
              />
            </div>
            <div className="pe-field">
              <label>Button Link</label>
              <input
                type="text"
                value={pageData.cta?.buttonLink || ''}
                onChange={(e) => setPageData({
                  ...pageData,
                  cta: { ...pageData.cta, buttonLink: e.target.value }
                })}
                placeholder="/contact"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditor;