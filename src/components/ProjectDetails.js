import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  Modal,
  Linking 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const API_URL = "http://10.1.226.6:5000";

const ProjectDetails = () => {
  const route = useRoute();
  const { project } = route.params;
  const [projectDetails, setProjectDetails] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableQuotedAmount, setEditableQuotedAmount] = useState('');
  const [predictionProjectName, setPredictionProjectName] = useState('');
  const [predictedAmount, setPredictedAmount] = useState(null);
  const [isEditingQuotedAmount, setIsEditingQuotedAmount] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [newTypeData, setNewTypeData] = useState({
    category: '',
    type: '',
    allocatedAmount: ''
  });
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [typeToEdit, setTypeToEdit] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState({
    name: '',
    type: '',
    date: ''
  });
  const [paymentTypeSearch, setPaymentTypeSearch] = useState('');
  // Add new state for ML prediction
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  // Category types mapping
  const [categoryTypes, setCategoryTypes] = useState({
  labour: [],
  material: [],
  machinery: []
});

  // Download helper function for React Native
  const downloadReport = async (url, filename) => {
    try {
      // First check if the URL is accessible
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // For React Native, open the URL in browser for download
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        Alert.alert(
          "Download Started", 
          `Opening ${filename} in browser for download.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Download URL", 
          `Copy this URL to download: ${url}`,
          [
            { text: "Copy URL", onPress: () => {
              // You can add clipboard functionality here if needed
              Alert.alert("Info", "URL copied to clipboard");
            }},
            { text: "OK" }
          ]
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert("Error", `Failed to download report: ${error.message}`);
    }
  };

  // Download functions for Project Details
  const downloadProjectPDF = () => {
    if (!project?.projectname) {
      Alert.alert("Error", "Project name not available");
      return;
    }
    const params = new URLSearchParams({
      projectname: project.projectname,
      type: 'employee',
      name: employeeSearch.name || '',
      etype: employeeSearch.type || '',
      date: employeeSearch.date || ''
    });
    const url = `${API_URL}/download-project-report-pdf?${params.toString()}`;
    downloadReport(url, `${project.projectname}_employee_report.pdf`);
  };

  const downloadProjectExcel = () => {
    if (!project?.projectname) {
      Alert.alert("Error", "Project name not available");
      return;
    }
    const params = new URLSearchParams({
      projectname: project.projectname,
      type: 'employee',
      name: employeeSearch.name || '',
      etype: employeeSearch.type || '',
      date: employeeSearch.date || ''
    });
    const url = `${API_URL}/download-project-report-excel?${params.toString()}`;
    downloadReport(url, `${project.projectname}_employee_report.xlsx`);
  };

  const downloadCategoryPDF = () => {
    if (!project?.projectname) {
      Alert.alert("Error", "Project name not available");
      return;
    }
    const params = new URLSearchParams({
      projectname: project.projectname,
      type: 'category',
      search: paymentTypeSearch || ''
    });
    const url = `${API_URL}/download-project-report-pdf?${params.toString()}`;
    downloadReport(url, `${project.projectname}_category_report.pdf`);
  };

  const downloadCategoryExcel = () => {
    if (!project?.projectname) {
      Alert.alert("Error", "Project name not available");
      return;
    }
    const params = new URLSearchParams({
      projectname: project.projectname,
      type: 'category',
      search: paymentTypeSearch || ''
    });
    const url = `${API_URL}/download-project-report-excel?${params.toString()}`;
    downloadReport(url, `${project.projectname}_category_report.xlsx`);
  };


  useEffect(() => {
    if (project) {
      fetchProjectDetails();
      fetchEmployeeData();
      fetchCategoryData();
    }
  }, [project]);

  useEffect(() => {
  fetchOptions();
}, []);

  const fetchOptions = async () => {
  try {
    const response = await fetch(`${API_URL}/get-options`);
    const data = await response.json();

    // Process the data to group labour, material, and machinery
    const labourList = [];
    const materialList = [];
    const machineryList = [];

    data.forEach(item => {
      if (item.labour && item.labour.trim() !== '') labourList.push(item.labour);
      if (item.material && item.material.trim() !== '') materialList.push(item.material);
      if (item.machinery && item.machinery.trim() !== '') machineryList.push(item.machinery);
    });

    setCategoryTypes({
      labour: labourList,
      material: materialList,
      machinery: machineryList
    });
  } catch (error) {
    console.error("Error fetching options:", error);
  }
};

  // Filter employee data based on search criteria
  const filteredEmployeeData = employeeData.filter(employee => {
    const nameMatch = employee.name.toLowerCase().includes(employeeSearch.name.toLowerCase());
    const typeMatch = employee.type.toLowerCase().includes(employeeSearch.type.toLowerCase());
    const dateMatch = employee.date.includes(employeeSearch.date);
    
    return nameMatch && typeMatch && dateMatch;
  });
  
  // Filter payment types based on search
  const filteredCategoryData = categoryData.filter(category => 
    category.type.toLowerCase().includes(paymentTypeSearch.toLowerCase())
  );

  // Calculate sum of filtered employee expenses
  const filteredEmployeeSum = filteredEmployeeData.reduce(
    (sum, employee) => sum + employee.amount, 
    0
  );

  // Calculate sum of filtered payment type expenses
  const filteredPaymentTypeSum = filteredCategoryData.reduce(
    (sum, category) => sum + category.expense, 
    0
  );

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/project-details?projectname=${project.projectname}`);
      if (!response.ok) throw new Error('Failed to fetch project details');
      const data = await response.json();
      setProjectDetails(data);
      setEditableQuotedAmount(data.quotedamount.toString());
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error.message);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`${API_URL}/get-expenses-for-deletion?projectname=${project.projectname}`);
      if (!response.ok) throw new Error('Failed to fetch employee details');
      const data = await response.json();
      setEmployeeData(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError(error.message);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${API_URL}/category-details?projectname=${project.projectname}`);
      if (!response.ok) throw new Error('Failed to fetch category details');
      const data = await response.json();
      
      // Remove duplicates by creating a map of unique types
      const uniqueTypes = {};
      data.forEach(item => {
        if (!uniqueTypes[item.type]) {
          uniqueTypes[item.type] = item;
        }
      });
      
      setCategoryData(Object.values(uniqueTypes));
    } catch (error) {
      console.error('Error fetching category details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAmount = async () => {
    if (!project.projectname) {
      Alert.alert("Error", "Please enter a project name");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/check-overrun`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectname: project.projectname }),
      });
  
      if (!response.ok) throw new Error('Failed to fetch predicted amount');
  
      const data = await response.json();
      setPredictedAmount(data.predicted_cost);
      Alert.alert("Prediction Success", `Predicted Amount: $${data.predicted_cost}`);
      Alert.alert("May be",`$${data.overrun}`)
    } catch (error) {
      console.error('Error fetching predicted amount:', error);
      Alert.alert("Error", "Failed to fetch predicted amount");
    }
  };

  // Add new function to check cost overrun prediction
  const checkCostOverrun = async () => {
    setPredictionLoading(true);
    setPredictionResult(null);
    
    try {
      const response = await fetch(`${API_URL}/check-overrun`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectname: project.projectname
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error('Prediction Error:', error);
      Alert.alert("Error", `Failed to get prediction: ${error.message}`);
    } finally {
      setPredictionLoading(false);
    }
  };

  const confirmDeleteExpense = (expense) => {
    console.log("Expense to delete:", {
      id: expense.id,
      date: expense.date,
      amount: expense.amount,
      type: expense.type,
      projectname: project.projectname
    });
    
    setExpenseToDelete(expense);
    setDeleteModalVisible(true);
  };
  const handleUpdateQuotedAmount = async () => {
    try {
      const response = await fetch(`${API_URL}/update-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectname: project.projectname,
          quotedamount: parseInt(editableQuotedAmount),
          totexpense: projectDetails.totexpense
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update project');
      
      const data = await response.json();
      setProjectDetails({...projectDetails, quotedamount: parseInt(editableQuotedAmount)});
      setIsEditingQuotedAmount(false);
      Alert.alert("Success", "Quoted amount updated successfully!");
    } catch (error) {
      console.error('Error updating quoted amount:', error);
      Alert.alert("Error", "Failed to update quoted amount");
    }
  };
  const handleDeleteExpense = async () => {
    if (!expenseToDelete?.uid) return;

    try {
        const response = await fetch(`${API_URL}/delete-expense`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uid: expenseToDelete.uid, // Only uid is needed
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete expense");
        }

        // Update local state: Remove deleted expense
        setEmployeeData(prev => prev.filter(e => e.uid !== expenseToDelete.uid));

        // Update project totals: Subtract expense
        setProjectDetails(prev => ({
            ...prev,
            totexpense: prev.totexpense - expenseToDelete.amount
        }));

        // Update category data: Subtract amount from the matching type
        setCategoryData(prev => prev.map(category =>
            category.type === expenseToDelete.type
                ? { ...category, expense: category.expense - expenseToDelete.amount }
                : category
        ));

        setDeleteModalVisible(false);
        Alert.alert("Success", "Expense deleted successfully!");
    } catch (error) {
        console.error("Delete Error:", error);
        Alert.alert("Error", error.message);
    }
};


  const handleAddNewType = async () => {
    if (!newTypeData.category || !newTypeData.type || !newTypeData.allocatedAmount) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add-payment-type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectname: project.projectname,
          type: newTypeData.type,
          estamount: parseInt(newTypeData.allocatedAmount),
          expense: 0
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add new type');
      
      const newType = {
        type: newTypeData.type,
        estamount: parseInt(newTypeData.allocatedAmount),
        expense: 0
      };
      
      setCategoryData([...categoryData, newType]);
      setNewTypeData({ category: '', type: '', allocatedAmount: '' });
      Alert.alert("Success", "New payment type added successfully!");
    } catch (error) {
      console.error('Error adding new type:', error);
      Alert.alert("Error", "Failed to add new payment type");
    }
  };

  const handleEditType = async () => {
    if (!typeToEdit || !typeToEdit.estamount) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update-payment-type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectname: project.projectname,
          type: typeToEdit.type,
          estamount: parseInt(typeToEdit.estamount)
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update type');
      
      const updatedCategoryData = categoryData.map(item => {
        if (item.type === typeToEdit.type) {
          return {...item, estamount: parseInt(typeToEdit.estamount)};
        }
        return item;
      });
      
      setCategoryData(updatedCategoryData);
      setEditTypeModalVisible(false);
      Alert.alert("Success", "Payment type updated successfully!");
    } catch (error) {
      console.error('Error updating type:', error);
      Alert.alert("Error", "Failed to update payment type");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078D4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!projectDetails) {
    return <Text>No project data available</Text>;
  }

  const { quotedamount, totexpense } = projectDetails;
  const balanceAmount = quotedamount - totexpense;

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{project.projectname}</Text>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Project Balance</Text>
            <Text style={styles.balanceAmount}>₹{balanceAmount.toFixed(2)}</Text>
            
            <View style={styles.balanceDetails}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Quoted</Text>
                {isEditingQuotedAmount ? (
                  <TextInput
                    style={styles.amountInput}
                    value={editableQuotedAmount}
                    onChangeText={setEditableQuotedAmount}
                    keyboardType="numeric"
                    autoFocus
                  />
                ) : (
                  <Text style={styles.balanceValue}>₹{quotedamount.toFixed(2)}</Text>
                )}
              </View>
              
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Spent</Text>
                <Text style={styles.balanceValue}>₹{totexpense.toFixed(2)}</Text>
              </View>
            </View>
            
            {isEditingQuotedAmount ? (
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleUpdateQuotedAmount}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => {
                    setIsEditingQuotedAmount(false);
                    setEditableQuotedAmount(quotedamount.toString());
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditingQuotedAmount(true)}
              >
                <Text style={styles.buttonText}>Edit Quoted Amount</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cost Prediction Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Prediction</Text>
          
          <View style={styles.predictionCard}>
            <Text style={styles.predictionText}>
              Get an ML-based prediction for the final cost of this project based on current progress and expenses.
            </Text>
            
            {predictionLoading ? (
              <ActivityIndicator size="large" color="#0078D4" style={styles.predictionLoading} />
            ) : predictionResult ? (
              <View style={styles.predictionResult}>
                <Text style={styles.predictionAmount}>
                  Predicted Final Cost: ₹{predictionResult.predicted_cost.toFixed(2)}
                </Text>
                
                <View style={[
                  styles.overrunIndicator, 
                  {backgroundColor: predictionResult.overrun ? '#FF3D71' : '#4CAF50'}
                ]}>
                  <Text style={styles.overrunText}>
                    {predictionResult.overrun ? 'Budget Overrun Predicted' : 'Within Budget'}
                  </Text>
                </View>
                
                {predictionResult.overrun && (
                  <Text style={styles.warningText}>
                    Warning: The project is predicted to exceed the quoted budget by 
                    ₹{(predictionResult.predicted_cost - quotedamount).toFixed(2)}
                  </Text>
                )}
                
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={checkCostOverrun}
                >
                  <Text style={styles.buttonText2}>Refresh Prediction</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.predictButton}
                onPress={checkCostOverrun}
              >
                <Text style={styles.buttonText2}>Generate Cost Prediction</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Employee Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Expenses</Text>
          
          {/* Export Buttons for Employee Expenses */}
          <View style={styles.exportContainer}>
            <Text style={styles.exportTitle}>Export Employee Data</Text>
            <View style={styles.exportButtons}>
              <TouchableOpacity 
                style={[styles.exportButton, styles.pdfButton]}
                onPress={downloadProjectPDF}
              >
                <Text style={styles.exportButtonText}>Download as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exportButton, styles.excelButton]}
                onPress={downloadProjectExcel}
              >
                <Text style={styles.exportButtonText}>Download as Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Employee Expenses Search */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              value={employeeSearch.name}
              onChangeText={(text) => setEmployeeSearch({...employeeSearch, name: text})}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by type..."
              value={employeeSearch.type}
              onChangeText={(text) => setEmployeeSearch({...employeeSearch, type: text})}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by date (YYYY-MM-DD)..."
              value={employeeSearch.date}
              onChangeText={(text) => setEmployeeSearch({...employeeSearch, date: text})}
              placeholderTextColor="#999"
            />
          </View>

          {/* Filtered employee list */}
          {filteredEmployeeData.map((item) => (
            <View key={item.uid} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseName}>{item.name}</Text>
                <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseType}>{item.type}</Text>
                <Text style={styles.expenseDate}>{item.date}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => confirmDeleteExpense(item)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Sum of filtered employee expenses */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total Filtered Expenses: ₹{filteredEmployeeSum.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Types</Text>
          
          {/* Export Buttons for Payment Types */}
          <View style={styles.exportContainer}>
            <Text style={styles.exportTitle}>Export Category Data</Text>
            <View style={styles.exportButtons}>
              <TouchableOpacity 
                style={[styles.exportButton, styles.pdfButton]}
                onPress={downloadCategoryPDF}
              >
                <Text style={styles.exportButtonText}>Download as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.exportButton, styles.excelButton]}
                onPress={downloadCategoryExcel}
              >
                <Text style={styles.exportButtonText}>Download as Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Payment Types Search */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search payment types..."
              value={paymentTypeSearch}
              onChangeText={setPaymentTypeSearch}
              placeholderTextColor="#999"
            />
          </View>

          {/* Filtered payment types list */}
          {filteredCategoryData.map((item) => (
            <View key={item.type} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryType}>{item.type}</Text>
                <TouchableOpacity 
                  style={styles.editTypeButton}
                  onPress={() => {
                    setTypeToEdit(item);
                    setEditTypeModalVisible(true);
                  }}
                >
                  <Text style={styles.editTypeButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.categoryDetails}>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryLabel}>Estimated</Text>
                  <Text style={styles.categoryValue}>₹{item.estamount.toFixed(2)}</Text>
                </View>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryLabel}>Actual</Text>
                  <Text style={styles.categoryValue}>₹{item.expense.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Sum of filtered payment type expenses */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total Filtered Expenses: ₹{filteredPaymentTypeSum.toFixed(2)}
            </Text>
          </View>

         
          <View style={styles.addTypeForm}>
            <Text style={styles.formTitle}>Add New Payment Type</Text>
            
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTypeData.category}
                style={styles.picker}
                onValueChange={(itemValue) => setNewTypeData({...newTypeData, category: itemValue, type: ''})}
              >
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Labour" value="labour" />
                <Picker.Item label="Material" value="material" />
                <Picker.Item label="Machinery" value="machinery" />
              </Picker>
            </View>
            
            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTypeData.type}
                style={styles.picker}
                onValueChange={(itemValue) => setNewTypeData({...newTypeData, type: itemValue})}
                enabled={newTypeData.category !== ''}
              >
                <Picker.Item label="Select Type" value="" />
                {newTypeData.category && categoryTypes[newTypeData.category]?.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.label}>Amount Allocated</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter allocated amount"
              value={newTypeData.allocatedAmount}
              onChangeText={(text) => setNewTypeData({...newTypeData, allocatedAmount: text})}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddNewType}
            >
              <Text style={styles.buttonText}>Add Payment Type</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Delete</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this expense of ₹{expenseToDelete?.amount.toFixed(2)}?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.deleteModalButton]}
                  onPress={handleDeleteExpense}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Type Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editTypeModalVisible}
        onRequestClose={() => setEditTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Payment Type</Text>
              <Text style={styles.modalText}>{typeToEdit?.type}</Text>
              
              <Text style={styles.label}>Estimated Amount</Text>
              <TextInput
                style={styles.input}
                value={typeToEdit?.estamount?.toString()}
                onChangeText={(text) => setTypeToEdit({...typeToEdit, estamount: text})}
                keyboardType="numeric"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => setEditTypeModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveModalButton]}
                  onPress={handleEditType}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#2E3A59',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    width: 100,
    textAlign: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#0078D4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText2: {
    color: '#0078D4',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0078D4',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0078D4',
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseType: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  expenseDate: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 5,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  editTypeButton: {
    padding: 5,
  },
  editTypeButtonText: {
    color: '#0078D4',
    fontSize: 14,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  addTypeForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2E3A59',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#2E3A59',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  deleteModalButton: {
    backgroundColor: '#FF3D71',
  },
  saveModalButton: {
    backgroundColor: '#4CAF50',
  },
  cancelModalButton: {
    backgroundColor: '#8F9BB3',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3D71',
  },
  searchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: '30%',
    height: 40,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 5,
    backgroundColor: '#F5F7FA',
  },
  summaryContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    alignItems: 'flex-end'
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59'
  },
  resultContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  resultValue: {
    fontSize: 16,
    color: '#2E3A59',
  },
  exportContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 10,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exportButton: {
    backgroundColor: '#0078D4',
    borderRadius: 8,
    padding: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#4CAF50',
  },
  excelButton: {
    backgroundColor: '#FF9800',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProjectDetails;