import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { FaFilePdf } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import apiService from '../../../apiService';
const statusInfo={'applied':'Applied','qualified':'Qualified','placed':'Placed','not-placed':'Not Placed','not-attended':'Not Attended','not-interested':'Not Interested','not-eligible':'Not Eligible','eligible':'Eligible/Profile Sent','under-progress':'Yet to receive feedback','level-1':'Level 1','level-2':'Level 2','level-3':'Level 3'}
const StudentsPlaced = ({ status }) => {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/job-applicants/${status}`;
        console.log(url);
        const response = await apiService.get(url);
        setData(response.data.map(item => ({ ...item, isEditing: false })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  

  const memoColumns = useMemo(() => [
    
    { Header: 'Full Name', accessor: 'fullName' },
    { Header: 'Contact Number', accessor: 'mobileNo' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Job Role', accessor: 'jobRole' },
    { Header: 'Company Name', accessor: 'companyName' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        let color;
        value=statusInfo[value]
        switch (value) {
          case 'In progress':
            color = 'yellow';
            break;
          case 'Qualified':
            color = 'green';
            break;
          case 'Not Qualified':
            color = 'red';
            break;
          default:
            color = 'blue';
        }
        return <span style={{ color, fontWeight: '600' }}>{value}</span>;
      }
      
    },
    { Header: 'Y.O.P', accessor: 'passedOut' },
    { Header: 'Gender', accessor: 'gender' },
    { Header: 'Experience', accessor: 'experience' },
    { Header: 'Resume', accessor: 'resume', disableSortBy: true }
  ], [selectedIds, data]);

  const memoData = useMemo(() => data, [data]);

  const downloadExcel = (completeData = false) => {
    const exportData = (completeData ? memoData : page).map(row => {
      const rowData = {};
      memoColumns.forEach(column => {
        if (column.accessor !== 'resume' && column.accessor !== 'selection') {
          rowData[column.Header] = row[column.accessor];
        }
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');
    XLSX.writeFile(workbook, `JobApplications${completeData ? '_Complete' : ''}.xlsx`);
  };

  const handleResumeDownload = async (applicationId) => {
    try {
      console.log("Id:", applicationId);
      // Send request to backend with applicationId
      const response = await apiService({
        url: `/download-resume/${applicationId.applicationID}`, // Update the endpoint to match your backend
        method: 'GET',
        responseType: 'blob', // Important for handling binary data
      });

      // Create a blob URL from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${applicationId.fullName}.pdf`; // Set a default file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Clean up
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize
  } = useTable(
    { columns: memoColumns, data: memoData, initialState: { pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;
  console.log("Data:", data);
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => gotoPage(i)}
          style={{ margin: '0 5px', outline: 'none', border: '1px solid #515357', fontWeight: '600',
            borderRadius: '2px', color: '#ffffff', padding: '5px 10px', cursor: 'pointer', backgroundColor: i === pageIndex ? '#416cb0' : '#9499a1' }}
        >
          {i + 1}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <Container fluid className='py-5' style={{ fontFamily: 'Calibri',width:'79vw' }}>
        <Row className='mb-3'>
          <Col>
            <h1>Students {statusInfo[status]}</h1>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col md={6}>
            <div className='d-flex align-items-center'>
              <p className='fw-bold me-2' style={{ fontSize: '20px' }}>
                Show
              </p>
              <Form.Select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className='me-2'
                style={{ width: 'auto' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
              <p className='fw-bold' style={{ fontSize: '20px' }}>
                entries
              </p>
            </div>
          </Col>
          <Col md={6} className='d-flex justify-content-end align-items-center'>
            <Form.Label className='me-2 mb-0' style={{ fontSize: '20px', fontWeight: 'bold' }}>Search:</Form.Label>
            <Form.Control
              type="search"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value || undefined)}
              placeholder="Search all columns"
              style={{ marginBottom: '10px', padding: '5px', height: '30px', border: '1px solid #737478', outline: 'none', borderRadius: '5px' }}
            />
          </Col>
        </Row>
        <Row className="mb-3 d-flex justify-content-between">
          <Col md={6} xs={10}>
            <Button onClick={() => downloadExcel(false)} style={{ height: '40px', marginRight: '10px', backgroundColor: '#6cde37', border: 'none', borderRadius: '5px', color: '#ffffff', fontWeight: 'bold',marginBottom:'5px' }}>
              Download Current Page as Excel
            </Button>
            <Button onClick={() => downloadExcel(true)} style={{ height: '40px', backgroundColor: '#37a6de', marginRight: '10px', border: 'none', borderRadius: '5px', color: '#ffffff', fontWeight: 'bold',marginBottom:'5px'}}>
              Download Complete Data as Excel
            </Button>
          </Col>
          
        </Row>
        <Row>
          <Col>
            <Table {...getTableProps()} bordered hover responsive className='table-striped'>
              <thead className='table-dark'>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        if (cell.column.id === 'resume') {
                          return (
                            <td {...cell.getCellProps()}>
                              <FaFilePdf
                                onClick={() => handleResumeDownload(row.original)}
                                style={{ cursor: 'pointer' }}
                                size={20}
                              />
                            </td>
                          );
                        }
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className='d-flex justify-content-between mt-3'>
          <Col md={4} style={{width:'70%'}}>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} className='btn btn-secondary'>
              Previous
            </Button>
            {renderPageNumbers()}
            <Button onClick={() => nextPage()} disabled={!canNextPage} className='btn btn-secondary ms-2'>
              Next
            </Button>
          </Col>
          
          
        </Row>
      </Container>
    </>
  );
};

export default StudentsPlaced;
