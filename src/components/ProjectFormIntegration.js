import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [tableData, setTableData] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState({});

  useEffect(() => {
    if (category) {
      axios.get(`http://192.168.151.233:5000/${category}`)
        .then(response => {
          const types = response.data[category] || [];
          const validTypes = types.filter(item => item && item.trim() !== '');
          setCategoryTypes(prevState => ({
            ...prevState,
            [category]: validTypes,
          }));
        })
        .catch(error => {
          console.error('Error fetching category types:', error);
          setCategoryTypes(prevState => ({
            ...prevState,
            [category]: [],
          }));
        });
    }
  }, [category]);

  const handleProjectSubmit = () => {
    if (projectName && estimatedAmount && tableData.length > 0) {
      const data = {
        projectname: projectName,
        estimated_amount: estimatedAmount,  // Matches fixed backend key
        rows: tableData.map((row) => ({
          category: row.category,
          type: row.type,
          estamount: row.amount, 
          expense: 0,
        })),
      };
  
      axios.post('http://192.168.151.233:5000/submit_project', data)
        .then(response => {
          alert('Project and payments added successfully!');
          setProjectName('');
          setEstimatedAmount('');
          setTableData([]);
        })
        .catch(error => {
          console.error('Error submitting project:', error);
          alert('Error submitting project!');
        });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleAddRow = () => {
    if (category && type && allocatedAmount && !isNaN(allocatedAmount)) {
      const newRow = {
        id: String(tableData.length + 1),
        category,
        type,
        amount: allocatedAmount,
      };
      setTableData([...tableData, newRow]);
      setCategory('');
      setType('');
      setAllocatedAmount('');
    } else {
      alert('Please fill in all fields correctly');
    }
  };

  return {
    projectName,
    setProjectName,
    estimatedAmount,
    setEstimatedAmount,
    category,
    setCategory,
    type,
    setType,
    allocatedAmount,
    setAllocatedAmount,
    tableData,
    setTableData,
    categoryTypes,
    handleProjectSubmit,
    handleAddRow
  };
};

export default useProjectForm;
