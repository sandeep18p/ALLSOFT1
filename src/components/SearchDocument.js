import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchDocuments, getDocumentTags } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagInput from './TagInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchDocument.css';

const SearchDocument = () => {
  const navigate = useNavigate();
  const { userName, mobileNumber, logout } = useAuth();
  const [searchParams, setSearchParams] = useState({
    major_head: '',
    minor_head: '',
    from_date: '',
    to_date: '',
    uploaded_by: '',
    start: 0,
    length: 500,
    filterId: '',
    search: { value: '' },
  });
  const [tags, setTags] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState(''); // 'image', 'pdf', or 'unsupported'

  const categories = [
    { value: 'Company', label: 'Personal' },
    { value: 'Professional', label: 'Professional' },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        ...searchParams,
        from_date: fromDate ? fromDate.toISOString().split('T')[0] : '',
        to_date: toDate ? toDate.toISOString().split('T')[0] : '',
        tags: tags.map((tag) => ({ tag_name: tag })),
      };
    console.log('Search Document Params:', params);
      const response = await searchDocuments(params);
      console.log('Search Document Response:', response);
      console.log('Search Document Response:', response.data);
      setSearchResults(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search documents');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (fileUrl, fileType, fileName) => {
    console.log('Preview requested for:', fileUrl, 'Type:', fileType, 'FileName:', fileName);
    
    // Use the provided URL as-is since it's already a full S3 URL
    const fullUrl = fileUrl;
    
    // Extract file extension from URL or filename
    const urlLower = (fileUrl || '').toLowerCase();
    let fileExtension = '';
    
    if (fileName) {
      const match = fileName.match(/\.([^.]+)$/);
      fileExtension = match ? match[1].toLowerCase() : '';
    } else if (fileUrl) {
      // Extract extension from URL (before query parameters)
      const urlWithoutParams = urlLower.split('?')[0];
      const match = urlWithoutParams.match(/\.([^.]+)$/);
      fileExtension = match ? match[1].toLowerCase() : '';
    }
    
    // Determine file type
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    // Check file type
    if (isImage || (fileType && fileType.startsWith('image/'))) {
      setPreviewType('image');
      setPreviewUrl(fullUrl);
      setShowPreview(true);
    }
    // Check if it's a PDF
    else if (isPDF || fileType === 'application/pdf') {
      setPreviewType('pdf');
      setPreviewUrl(fullUrl);
      setShowPreview(true);
    }
    // Unsupported file type
    else {
      setPreviewType('unsupported');
      setPreviewUrl('');
      setShowPreview(true);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      console.log('Downloading:', fileUrl, fileName);
      
      // Use the provided URL as-is since it's already a full S3 URL
      const fullUrl = fileUrl;
      
      // Extract file extension from URL or filename
      const urlLower = (fileUrl || '').toLowerCase();
      let fileExtension = '';
      
      if (fileName) {
        const match = fileName.match(/\.([^.]+)$/);
        fileExtension = match ? match[1].toLowerCase() : '';
      } else if (fileUrl) {
        // Extract extension from URL (before query parameters)
        const urlWithoutParams = urlLower.split('?')[0];
        const match = urlWithoutParams.match(/\.([^.]+)$/);
        fileExtension = match ? match[1].toLowerCase() : '';
      }
      
      // Check if it's a supported file type (image or PDF)
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
      const isPDF = fileExtension === 'pdf';
      
      if (!isImage && !isPDF) {
        alert('Download not supported for this file type');
        return;
      }
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName || 'document';
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDownloadAll = () => {
    if (searchResults.length === 0) {
      alert('No documents to download');
      return;
    }
    alert('Bulk download feature would be implemented here');
  };

  return (
    <div className="search-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <strong>AllSoft</strong> Document Management
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">{userName || mobileNumber}</span>
            <button className="btn btn-link btn-sm me-2" onClick={() => navigate('/')}>
              Home
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="mb-4">Search Documents</h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Major Head (Category)</label>
                    <select
                      className="form-select"
                      value={searchParams.major_head}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, major_head: e.target.value })
                      }
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minor Head</label>
                    <input
                      type="text"
                      className="form-control"
                      value={searchParams.minor_head}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, minor_head: e.target.value })
                      }
                      placeholder="Name or Department"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">From Date</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select from date"
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">To Date</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select to date"
                      isClearable
                      minDate={fromDate}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tags</label>
                    <TagInput
                      tags={tags}
                      onChange={(newTags) => setTags(newTags)}
                      placeholder="Add tags to search..."
                    />
                  </div>


                  <div className="col-md-6 mb-3">
                    <label className="form-label">Uploaded By</label>
                    <input
                      type="text"
                      className="form-control"
                      value={searchParams.uploaded_by}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, uploaded_by: e.target.value })
                      }
                      placeholder="Enter user ID"
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary me-2"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchParams({
                          ...searchParams,
                          major_head: '',
                          minor_head: '',
                          uploaded_by: '',
                        });
                        setTags([]);
                        setFromDate(null);
                        setToDate(null);
                        setSearchResults([]);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
            

            {searchResults.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Search Results ({searchResults.length})</h5>
                    <button className="btn btn-success" onClick={handleDownloadAll}>
                      Download All as ZIP
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                    <thead>
  <tr>
    <th>Name</th>
    <th>Major Head</th>
    <th>Minor Head</th>
    <th>Date</th>
    <th>Uploaded By</th>
    <th>Upload Time</th>
    <th>Remarks</th>
    <th>Tags</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {searchResults.map((doc, idx) => {
    // Extract filename from URL if not provided
    let displayName = doc.file_name || 'Document';
    if (!doc.file_name && doc.file_url) {
      const urlParts = doc.file_url.split('?')[0].split('/');
      displayName = urlParts[urlParts.length - 1] || 'Document';
    }
    
    return (
      <tr key={idx}>
        <td>{displayName}</td>
        <td>{doc.major_head || '-'}</td>
        <td>{doc.minor_head || '-'}</td>
        <td>{doc.document_date || '-'}</td>
        <td>{doc.uploaded_by || doc.user_id || '-'}</td>
        <td>{doc.upload_time || doc.created_at || '-'}</td>
        <td>{doc.document_remarks || '-'}</td>
        <td>
          {doc.tags && doc.tags.map((tag, i) => (
            <span key={i} className="badge bg-info me-1">
              {tag.tag_name}
            </span>
          ))}
        </td>
        <td>
        <button
            className="btn btn-sm btn-outline-primary me-1"
            onClick={() => handlePreview(doc.file_url, doc.file_type, doc.file_name || displayName)}
          >
            Preview
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => handleDownload(doc.file_url, doc.file_name || displayName)}
          >
            Download
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewUrl('');
                    setPreviewType('');
                  }}
                ></button>
              </div>
              <div className="modal-body text-center">
                {previewType === 'image' && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  />
                )}
                {previewType === 'pdf' && (
                  <iframe
                    src={previewUrl}
                    title="PDF Preview"
                    style={{ width: '100%', height: '70vh', border: 'none' }}
                  />
                )}
                {previewType === 'unsupported' && (
                  <div>
                    <p className="alert alert-warning">
                      Preview not available for this file type.
                      <br />
                      Please use the download button to access the file.
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewUrl('');
                    setPreviewType('');
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDocument;

