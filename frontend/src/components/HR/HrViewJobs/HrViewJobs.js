import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Form, Button, Row, Col } from 'react-bootstrap';

import { toast } from 'react-toastify';
import apiService from '../../../apiService';
import { FaCheck, FaChevronRight, FaTimes } from 'react-icons/fa';

import { MdEdit, MdDelete } from 'react-icons/md';
import HrNavbar from '../HrNavbar/HrNavbar';
import EditJobModal from '../EditJobModal/EditJobModal';
import { RxDotFilled } from "react-icons/rx";
import { useNavigate,Link} from 'react-router-dom';
import './HrViewJobs.css';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUserFriends, FaCalendarAlt,FaAngleRight } from 'react-icons/fa';
import Cookies from 'js-cookie'
import { FcExpired } from 'react-icons/fc';
import {Pagination, Box} from '@mui/material';

const statusInfo={'jd-received':'JD Received','profiles-sent':'Profiles sent','drive-scheduled':'Drive Scheduled','drive-done':'Drive Done','not-interested':"Not Interested"} 
const HrId=Cookies.get('HRid')
const HrViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // For pagination
  const jobsPerPage = 6;  // Number of jobs per page
  const [selectedYear, setSelectedYear] = useState(''); // For year filter
  const [selectedMonth, setSelectedMonth] = useState('');

  const [hrId,setHrId]=useState(HrId);
  console.log(hrId);

  useEffect(() => {
    
    fetchJobs();
  }, [hrId]);
  

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

      console.log("HR",hrId)
      const response = await apiService.get(`/hr-view-jobs?hrId=${hrId}`);

      
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
/*
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
*/
console.log(jobs)
const indexOfLastJob = currentPage * jobsPerPage;

  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  console.log(indexOfFirstJob,indexOfLastJob)
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  console.log(selectedYear,selectedMonth)
const lastDate = new Date("2024-08-27T18:30:00.000Z");
console.log(lastDate)
const currentDate = new Date();

const handlePageChange = (event, value) => {
  setCurrentPage(value);
};
  return (
    <div style={{ overflowY: 'scroll',height:'150vh',paddingBottom:'10px' }}>
      <HrNavbar />
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

      <Container fluid className="px-0 ml-auto mr-auto mb-5" style={{ width: '95vw', height: "100vh" }}>
        {filteredJobs.length > 0 ? (
          <Row xs={1} sm={1} md={2} lg={3} className="g-4">
            {currentJobs.map(job => (
              
              <Col key={job.jobId}>
      <div
        className="card h-100"
        style={{
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)',
          borderRadius: '10px',
          padding: '5px',
        }}
        onClick={() => window.location.href = `/hr-dashboard/job/${job.jobId}`}

      >
        <div className="card-body">
          <div className="d-flex justify-content-between ">
            <div>
              <h5 className="card-title fw-bold">{job.jobTitle}</h5>
              <p className="card-subtitle mb-2 text-muted">{job.companyName}</p>
            </div>
            {new Date(job.lastDate) < currentDate && <span style={{ fontWeight: '500', color: '#fa3e4b' }}><FcExpired />Applications closed</span>}
            
          </div>

          <div className="mt-3">
            
              <p><FaMapMarkerAlt className="me-2" />Location: <span> {job.Location}</span></p>
              
            
            <div className="d-flex mb-2">
              <FaMoneyBillWave className="me-2" /> <span>CTC: {job.salary}</span>
            </div>
            <div className="d-flex mb-2">
              <FaUserFriends className="me-2" /> <span>Openings: {job.openings}</span>
            </div>
            <div className="d-flex mb-2">
              <FaCalendarAlt className="me-2" /> <span>Apply By: {formatDate(job.lastDate)}</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span
              style={{
                border: '1px solid #fdf3c6',
                borderRadius: '5px',
                padding: '5px',
                fontSize: '12px',
                backgroundColor: '#fdf3c6',
                color: '#943d0e',
                fontWeight: '500',
              }}
            >
              <RxDotFilled /> {statusInfo[job.status]}
            </span>
            <Link
            to={`/hr-dashboard/job/${job.jobId}`}
            style={{ textDecoration: 'none', color: '#53289e', fontWeight: '500' }}
            className="btn btn-link p-0"
>
  View Details
  <FaChevronRight className='ms-1' size={15} />
</Link>
          </div>
        </div>
      </div>
    </Col>
              
            ))}
          </Row>
        ) : (
          <h2 className='text-center text-secondary'>No jobs to display</h2>
        )}
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
    </div>
  );
};

export default HrViewJobs;