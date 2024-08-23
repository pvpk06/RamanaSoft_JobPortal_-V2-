import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { IoPersonAddSharp } from "react-icons/io5";
import { FaChevronCircleRight, FaCheck, FaTimes, FaUserTie } from "react-icons/fa";
import './SA_home.css';
import apiService from '../../../apiService';

const SAHome = ({ onCardClick }) => {
  const [statistics, setStatistics] = useState([
    { title: 'Total Students Applied', value: 0, view: 'studentsApplied', color: '#37a6b8', element: IoPersonAddSharp },
    { title: 'Total Students Qualified', value: 0, view: 'studentsQualified', color: '#e8c93f', element: FaCheck },
    { title: 'Total Students Placed', value: 0, view: 'studentsPlaced', color: '#21bf40', element: FaUserTie },
    { title: 'Students Not Placed', value: 0, view: 'studentsNotPlaced', color: '#f73643', element: FaTimes },
    { title: 'Total HR Leads', value: 0, view: 'hrLeads', color: '#838485', element: IoPersonAddSharp },
    { title: 'HR Confirmed Leads', value: 0, view: 'hrConfirmedLeads', color: '#21bf40', element: FaCheck },
    { title: 'Recruiters', value: 0, view: 'recruiters', color: '#3377f5', element: FaUserTie },
    { title: 'Not Interested HRs', value: 0, view: 'notInterestedHrs', color: '#49494a', element: FaTimes }
  ]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [
          { data: applied },
          { data: qualified },
          { data: placed },
          { data: notPlaced },
          { data: hrLeads },
          { data: confirmedLeads },
          { data: recruiters },
          { data: notInterestedHrs }
        ] = await Promise.all([
          apiService.get('/statistics/applied'),
          apiService.get('/statistics/qualified'),
          apiService.get('/statistics/placed'),
          apiService.get('/statistics/not-qualified'),
          apiService.get('/statistics/hr-leads'),
          apiService.get('/statistics/hr-confirmed-leads'),
          apiService.get('/statistics/recruiters'),
          apiService.get('/statistics/not-interested-hrs')
        ]);

        setStatistics(prevStats => prevStats.map(stat => {
          switch (stat.title) {
            case 'Total Students Applied':
              return { ...stat, value: applied.count };
            case 'Total Students Qualified':
              return { ...stat, value: qualified.count };
            case 'Total Students Placed':
              return { ...stat, value: placed.count };
            case 'Total Students Not Placed':
              return { ...stat, value: notPlaced.count };
            case 'Total HR Leads':
              return { ...stat, value: hrLeads.count };
            case 'HR Confirmed Leads':
              return { ...stat, value: confirmedLeads.count };
            case 'Recruiters':
              return { ...stat, value: recruiters.count };
            case 'Not Interested HRs':
              return { ...stat, value: notInterestedHrs.count };
            default:
              return stat;
          }
        }));
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const handleCardClick = (view) => {
    onCardClick(view);
  };

  return (
    <div className="sa-home-container">

    </div>
  );
};

export default SAHome;
