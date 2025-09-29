import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #888',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 10,
    color: '#777',
  },
  table: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  col1: { width: '25%', paddingHorizontal: 5 },
  col2: { width: '20%', paddingHorizontal: 5 },
  col3: { width: '15%', paddingHorizontal: 5 },
  col4: { width: '15%', paddingHorizontal: 5 },
  col5: { width: '25%', paddingHorizontal: 5 },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 9,
  },
  notes: {
    fontSize: 8,
    color: '#555',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#555',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    marginBottom: 3,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#777',
  },
});

// Create the PDF Document component
const RentalHistoryPDF = ({ rentals }) => {
  // Calculate summary data
  const totalRentals = rentals.length;
  const uniqueTools = new Set(rentals.map(rental => rental.toolId?._id)).size;
  const uniqueUsers = new Set(rentals.map(rental => rental.userId?._id)).size;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Rental History Report</Text>
            <Text style={styles.subtitle}>Equipment Tool Management System</Text>
            <Text style={styles.reportDate}>
              Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Text>
          </View>
          {/* If you have a company logo, add it here */}
          {/* <Image style={styles.logo} src="/path/to/logo.png" /> */}
        </View>
        
        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.col1}><Text style={styles.headerText}>Tool</Text></View>
            <View style={styles.col2}><Text style={styles.headerText}>Rented By</Text></View>
            <View style={styles.col3}><Text style={styles.headerText}>Start Date</Text></View>
            <View style={styles.col4}><Text style={styles.headerText}>Return Date</Text></View>
            <View style={styles.col5}><Text style={styles.headerText}>Notes</Text></View>
          </View>
          
          {/* Table Rows */}
          {rentals.map((rental, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={styles.cellText}>
                  {rental.toolId ? rental.toolId.model : "Unknown Tool"}
                </Text>
                <Text style={[styles.cellText, {fontSize: 7, color: '#777'}]}>
                  {rental.toolId ? `SN: ${rental.toolId.serial}` : ""}
                </Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.cellText}>
                  {rental.userId ? 
                    (rental.userId.name || `User #${rental.userId._id?.toString().slice(-6)}`) : 
                    "Unknown User"}
                </Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.cellText}>
                  {new Date(rental.rentalStartDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.col4}>
                <Text style={styles.cellText}>
                  {rental.actualReturnDate ? 
                    new Date(rental.actualReturnDate).toLocaleDateString() : 
                    new Date(rental.rentalEndDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.col5}>
                <Text style={styles.notes}>
                  {rental.notes || "No notes"}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Summary Section */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>Total Rentals: {totalRentals}</Text>
          <Text style={styles.summaryText}>Unique Tools: {uniqueTools}</Text>
          <Text style={styles.summaryText}>Unique Users: {uniqueUsers}</Text>
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Equipment Tool Management System - Confidential
        </Text>
        
        {/* Page Number */}
        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>
    </Document>
  );
};

export default RentalHistoryPDF;