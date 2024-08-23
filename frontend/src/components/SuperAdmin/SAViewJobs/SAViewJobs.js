import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete } from 'react-icons/md';
import EditJobModal from '../EditJobModal/EditJobModal';
import { RxDotFilled } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import { FcExpired } from 'react-icons/fc';
import {Pagination, Box} from '@mui/material';  // Import MUI Pagination
import apiService from '../../../apiService';
const SAViewJobs = () => {
  const currentDate = new Date();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // For pagination
  const jobsPerPage = 6;  // Number of jobs per page
  const [selectedYear, setSelectedYear] = useState(''); // For year filter
  const [selectedMonth, setSelectedMonth] = useState(''); // For month filter

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      let filtered = jobs.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.phone.includes(searchTerm) ||
        job.jobCity.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedYear) {
        filtered = filtered.filter(job => new Date(job.postedOn).getFullYear() === parseInt(selectedYear));
      }

      if (selectedMonth) {
        filtered = filtered.filter(job => new Date(job.postedOn).getMonth() === parseInt(selectedMonth) - 1);
      }

      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm, selectedYear, selectedMonth]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  const fetchJobs = async () => {
    try {
      const response = await apiService.get("/view-jobs");
      const sortedJobs = response.data.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleSave = async (updatedJob) => {
    const changedValues = {};
    const originalJob = filteredJobs.find(job => updatedJob.jobId === job.jobId);
    for (let key in updatedJob) {
      if (updatedJob.hasOwnProperty(key) && originalJob.hasOwnProperty(key)) {
        if (updatedJob[key] !== originalJob[key]) {
          changedValues[key] = updatedJob[key];
        }
      }
    }
    try {
      await apiService.post("/update-job", { changedValues, jobId: updatedJob.jobId });
      toast.success(`Job updated successfully`, { autoClose: 5000 });
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      console.error('There was an error updating the job!', error);
      toast.error(`${error.response.data.error}`, { autoClose: 5000 });
    }
  };

  const handleDelete = async (job) => {
    try {
      console.log(job);
      await apiService.delete(`/delete-job/${job.jobId}`);
      toast.success("Job deleted successfully!", { autoClose: 5000 });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(`There was an error deleting the job ${error}`, { autoClose: 5000 });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (criteria) => {
    const sortedJobs = [...jobs].sort((a, b) => {
      if (criteria === 'name') {
        return a.jobRole.localeCompare(b.jobRole);
      } else if (criteria === 'date') {
        return new Date(b.postedOn) - new Date(a.postedOn);
      } else if (criteria === 'company') {
        return a.companyName.localeCompare(b.companyName);
      }
      return 0;
    });
    setSortCriteria(criteria);
    setJobs(sortedJobs);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Container className="my-4">
        <div className="d-flex flex-row justify-content-between">
          <h1 style={{ color: '#888888', fontWeight: 'bold', fontSize: '25px' }}>Available Jobs</h1>
        </div>
        <Row className="my-3">
          <Col md={6}>
            <Form.Control as="select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              {/* Add more years as needed */}
            </Form.Control>
          </Col>
          <Col md={6}>
            <Form.Control as="select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Form.Control>
          </Col>
        </Row>
      </Container>

      <Container style={{width:"1200px"}}>
        {currentJobs.length > 0 ? (
          <Row xs={1} sm={1} md={2} lg={3} >
            {currentJobs.map(job => (
              <Col key={job.jobId} style={{marginBottom:"20px"}}>
                <div
                  className="card h-100"
                  style={{
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)',
                    borderRadius: '10px',
                    padding: '5px',
                  }}
                >
                  <div className="card-body" >
                    <div className="d-flex justify-content-between ">
                      <div>
                        <h5 className="card-title fw-bold">{job.jobTitle}</h5>
                        <p className="card-subtitle mb-2 text-muted">{job.companyName}</p>
                      </div>

                      {new Date (job.lastDate) < currentDate && <span style={{ fontWeight: '500', color: '#fa3e4b' }}><FcExpired />Applications closed</span>}
                    </div>
                    <div>
                      <p ><RxDotFilled /> <strong style={{color:"black"}}>Job Role:</strong> {job.jobTitle}</p>
                      <p ><RxDotFilled /> <strong style={{color:"black"}}>Location: </strong>{job.Location}</p>
                      <p ><RxDotFilled /> <strong style={{color:"black"}}>Start Date : </strong>{formatDate(job.postedOn)}</p>
                      <p ><RxDotFilled /> <strong style={{color:"black"}}>Last Date : </strong>{formatDate(job.lastDate)}</p>
                      <p ><RxDotFilled /> <strong style={{color:"black"}}>Date Posted: </strong>{formatDate(job.postedOn)}</p>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <Link to={`/SA_dash/job_desc/${job.jobId}`}>
                        <button className="btn btn-outline-secondary mx-1"><FaAngleRight /> Details</button>
                      </Link>
                      <button className="btn btn-outline-primary mx-1" onClick={() => handleEdit(job)}><MdEdit /> Edit</button>
                      <button className="btn btn-outline-danger mx-1" onClick={() => handleDelete(job)}><MdDelete /> Delete</button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No jobs available.</p>
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Pagination
          count={Math.ceil(filteredJobs.length / jobsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          className="mt-4"
          size="large"
        />
        </Box>
      </Container>

      {selectedJob && (
        <EditJobModal
          show={showModal}
          job={selectedJob}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SAViewJobs;
