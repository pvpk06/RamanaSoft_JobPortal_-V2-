import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import ramana from '../images/p3.jpeg';
import logo from '../images/avatar2.avif'

const JobDesc = () => {
  const { jobId } = useParams();
  const [company, setCompany] = useState(null);
  console.log(company)

  useEffect(() => {
    // Replace with actual data fetching logic
    const dummyData = {
      JS001: { id: 'JS001', name: 'Tech Innovators Inc.', description: 'Innovative tech solutions.', jobType: 'Full-Time', city: 'Pune' },
      JS002: { id: 'JS002', name: 'CodeCrafters Ltd.', description: 'Crafting code with care.', jobType: 'Part-Time', city: 'Madurai' },
    };
    
    setCompany(dummyData[jobId]);
  }, [jobId]);

  if (!company) {
    return <p>Loading...</p>;
  }

  return (
    <>

    <div>
    <img src={ramana} alt='logo' className='rounded mt-3 ms-3' style={{width:'200px'}}/>
    <div style={{float:'right'}} className='p-3 rounded me-3'>
      <img src={logo} alt='profile' className='rounded' style={{width:'50px',height:'50px'}}/>
    </div>
    </div>
    <h3 className='text-center fw-bold text-decoration-underline'>Job description </h3>
    <Container className='border p-3 rounded shadow mt-5'>
      <h1 className='fw-bold'>{company.name}</h1>
      <p><strong>Job ID:</strong> {company.id}</p>
      <p><strong>Job Role:</strong>Software Developer </p>
      <p><strong>Job Category:</strong> Technical Support</p>
      <p><strong>Job Type:</strong> {company.jobType}</p>
      <p><strong>City:</strong> {company.city}</p>
      <p><strong>Experience :</strong>  0-1 Exp</p>
      <p><strong>Qualification :</strong>B.Tech/B.sc</p>
      <p><strong>Salary :</strong> 25k-30k/month</p>
      <p><strong>description :</strong>{company.description}</p>
      <h5 className='fw-bold text-danger mb-3'>Posted by: Hari Manas [Ameerpet]-7993467747</h5>
      <div className='d-flex justify-content-around w-25'>
      <Button variant="secondary" className='px-5'><Link to='/dashboard' className='text-decoration-none text-dark fw-bold text-white text-nowrap'><i class="fa-solid fa-left-long"></i> Back</Link></Button>
      <Button variant="primary" className='fw-bold ms-2 px-5'><Link to='/apply-job' className='text-decoration-none text-dark fw-bold text-nowrap text-white'>Apply Now</Link></Button>
      </div>
    </Container>
    </>
  );
};

export default JobDesc;
