import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadDocument, getDocumentTags } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagInput from './TagInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UploadDocument.css';

const UploadDocument = () => {
  const navigate = useNavigate();
  const { userName, mobileNumber, userId, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentDate, setDocumentDate] = useState(new Date());
  const [majorHead, setMajorHead] = useState('Personal');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTags, setAvailableTags] = useState([]);


  const personalNames = ['John', 'Tom', 'Emily', 'Sarah', 'Michael'];
  const professionalDepartments = ['Accounts', 'HR', 'IT', 'Finance', 'Marketing'];

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      const response = await getDocumentTags();
      if (response && response.data) {
        console.log('Available Tags:', response.data);
        console.log('Available Tags:', response.data.map((tag) => tag.label));
        setAvailableTags(response.data.map((tag) => tag.label));
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();
      

      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
      

      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      
     
      const hasValidExtension = allowedExtensions.includes(fileExtension);
    
      const hasValidMimeType = allowedMimeTypes.includes(file.type) || file.type.startsWith('image/');
      
      if (hasValidExtension && hasValidMimeType) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Only image files (JPG, JPEG, PNG, GIF, WEBP) and PDF files are allowed');
        e.target.value = '';
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    // Validate file type before submission
    const fileName = selectedFile.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    const hasValidExtension = allowedExtensions.includes(fileExtension);
    const hasValidMimeType = selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf';

    if (!hasValidExtension || !hasValidMimeType) {
      setError('Only image files (JPG, JPEG, PNG, GIF, WEBP) and PDF files are allowed');
      return;
    }

    if (!minorHead) {
      setError('Please select a name or department');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: formatDate(documentDate),
      document_remarks: remarks,
      tags: tags.map((tag) => ({ tag_name: tag })),
      user_id: userId || mobileNumber,
    };

    try {
      await uploadDocument(selectedFile, formData);
      setSuccess('Document uploaded successfully!');
      // Reset form
      setSelectedFile(null);
      setMinorHead('');
      setTags([]);
      setRemarks('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h2 className="mb-4">Upload Document</h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                      Select File (Image or PDF)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Document Date</label>
                    <DatePicker
                      selected={documentDate}
                      onChange={(date) => setDocumentDate(date)}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={majorHead}
                      onChange={(e) => {
                        setMajorHead(e.target.value);
                        setMinorHead('');
                      }}
                    >
                      {/* <option value="Personal">Personal</option>
                       */}
                      <option value="Personal">Personal</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {majorHead === 'Personal' ? 'Name' : 'Department'}
                    </label>
                    <select
                      className="form-select"
                      value={minorHead}
                      onChange={(e) => setMinorHead(e.target.value)}
                    >
                      <option value="">Select {majorHead === 'Personal' ? 'Name' : 'Department'}</option>
                      {majorHead === 'Personal'
                        ? personalNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))
                        : professionalDepartments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <TagInput
                      tags={tags}
                      onChange={(newTags) => setTags(newTags)}
                      placeholder="Add tags and press Enter..."
                    />
                    {availableTags.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Suggested tags: </small>
                        {availableTags.slice(0, 5).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary me-1 cursor-pointer"
                            onClick={() => {
                              if (!tags.includes(tag)) {
                                setTags([...tags, tag]);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="remarks" className="form-label">
                      Remarks
                    </label>
                    <textarea
                      className="form-control"
                      id="remarks"
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks..."
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Uploading...' : 'Upload Document'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;

