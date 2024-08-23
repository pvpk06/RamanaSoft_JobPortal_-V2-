import React, { useState } from 'react';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import HrNavbar from '../HrNavbar/HrNavbar';
import Cookies from 'js-cookie'
const HrId=Cookies.get('HRid')
const AddHr = () => {
  const [formData, setFormData] = useState({
    hrName: '',
    companyName: '',
    website: '',
    email: '',
    phoneNumber: '',
    address: '',
    publishedHr: '',
    hrId:HrId
  });

  const [errors, setErrors] = useState({});

  const validate = (field, value) => {
    const errors = {};

    if (field === 'hrName' && !value) errors.hrName = 'HR name is required';
    if (field === 'companyName' && !value) errors.companyName = 'Company name is required';
    if (field === 'website' && !value) errors.website = 'Website is required';
    if (field === 'email') {
      if (!value) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = 'Email address is invalid';
      }
    }
    if (field === 'phoneNumber') {
      if (!value) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(value)) {
        errors.phoneNumber = 'Phone number is invalid';
      }
    }
    if (field === 'address' && !value) errors.address = 'Address is required';
    if (field === 'publishedHr' && !value) errors.publishedHr = 'Published HR is required';

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being changed
    setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const validationErrors = validate(name, value);
    setErrors({ ...errors, ...validationErrors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      const validationErrors = validate(key, formData[key]);
      if (Object.keys(validationErrors).length > 0) {
        allErrors[key] = validationErrors[key];
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      await apiService.post('/add-hr', formData);
      toast.success('HR added successfully!', { autoClose: 5000 });
      setFormData({
        hrName: '',
        companyName: '',
        website: '',
        email: '',
        phoneNumber: '',
        address: '',
        publishedHr: ''
      });
      setErrors({});
    } catch (error) {
      toast.error(`Error adding HR: ${error.message}`, { autoClose: 5000 });
    }
  };

  return (
    <div style={{ fontFamily: 'Roboto' }}>
      <HrNavbar />
      <Container
        style={{
          backgroundColor: '#fffff8',
          width: '90%',
          marginBottom:'20px',
          marginTop: '20px',
          boxShadow: '0 4px 8px 0 #d8e0ed, 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        }}
      >
        <h2>Add HR</h2>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6} sm={12} xs={12}>
              <label>HR Name:</label>
              <br />
              <input
                type="text"
                name="hrName"
                value={formData.hrName}
                onChange={handleChange}
                onBlur={handleBlur}
                
              />
              {errors.hrName && <p style={{ color: 'red' }}>{errors.hrName}</p>}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Company Name:</label>
              <br />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.companyName && (
                <p style={{ color: 'red' }}>{errors.companyName}</p>
              )}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Website:</label>
              <br />
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.website && <p style={{ color: 'red' }}>{errors.website}</p>}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Email:</label>
              <br />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Phone Number:</label>
              <br />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p style={{ color: 'red' }}>{errors.phoneNumber}</p>
              )}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Address:</label>
              <br />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
            </Col>
            <Col lg={6} sm={12} xs={12}>
              <label>Published HR:</label>
              <br />
              <input
                type="text"
                name="publishedHr"
                value={formData.publishedHr}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.publishedHr && (
                <p style={{ color: 'red' }}>{errors.publishedHr}</p>
              )}
            </Col>
          </Row>
          <Row className="d-flex flex-row justify-content-center mt-3 mb-3">
            <Col lg={4}>
              <button className="w-100 mb-3" type="submit">
                Add HR
              </button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};

export default AddHr;
