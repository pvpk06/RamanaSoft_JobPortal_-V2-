import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiService from '../../../apiService';
import HrNavbar from '../HrNavbar/HrNavbar';
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const HRid = Cookies.get('HRid');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    dob: '',
    address: '',
    workEmail: '',
    workMobile: '',
    emergencyContactName: '',
    emergencyContactAddress: '',
    emergencyContactMobile: '',
    gender: '',
    branch: '',
    password: ''
  });

  useEffect(() => {
    const fetchHRData = async () => {
      const response = await apiService.get(`/hr-profile/${HRid}`);
      setProfile(response.data);
    };
    fetchHRData();
  }, [HRid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.put(`/hr-profile/${HRid}`, profile);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div style={{overflow:"hidden"}}>
      <HrNavbar />
      <Container className=" bg-light" style={{width:'80%', overflow:"auto",marginTop:"30px",marginBottom:"30px", }}>
        <div className="py-4">
          <h2 className="mb-4">Your Details </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="mobileNo"
                value={profile.mobileNo}
                onChange={handleChange}
                placeholder="Mobile No"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                placeholder="DOB"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="workEmail"
                value={profile.workEmail}
                onChange={handleChange}
                placeholder="Work Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="workMobile"
                value={profile.workMobile}
                onChange={handleChange}
                placeholder="Work Mobile"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="emergencyContactName"
                value={profile.emergencyContactName}
                onChange={handleChange}
                placeholder="Emergency Contact Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="emergencyContactAddress"
                value={profile.emergencyContactAddress}
                onChange={handleChange}
                placeholder="Emergency Contact Address"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="emergencyContactMobile"
                value={profile.emergencyContactMobile}
                onChange={handleChange}
                placeholder="Emergency Contact Mobile"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                placeholder="Gender"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                placeholder="Branch"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>
            <div>
              <Button variant="primary" type="submit" className="me-2">
                UPDATE
              </Button>
              <Button variant="secondary" type="button">
                CANCEL
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div >
  );
};

export default ProfilePage;