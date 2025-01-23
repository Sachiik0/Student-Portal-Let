'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Importing from next/navigation for dynamic params
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, CircularProgress } from '@mui/material';

export default function SubjectPage() {
  const { idNumber, subjectid } = useParams(); // Extracting idNumber and subjectid from the URL
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (subjectid && idNumber) {
      setIsLoading(true); // Set loading to true before fetching
      fetchSubjectData(subjectid, idNumber);
    }
  }, [subjectid, idNumber]); // Run whenever subjectid or idNumber changes

  const fetchSubjectData = async (subjectId, idNumber) => {
    try {
      const response = await fetch('/api/student/grades/college/fetch-criteria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectid: subjectId, idNumber: idNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setError('');
      } else {
        setData(null);
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while fetching the data');
      setData(null);
    } finally {
      setIsLoading(false); // Stop loading when data fetch is complete
    }
  };

  const renderActivityData = (prefix) => {
    if (!data) return null;

    const title = data[`${prefix}_Title`];
    
    // Only render if the activity title is not null or empty
    if (!title) return null;

    // Filter criteria where title is not null or empty
    const criteria = Array.from({ length: 5 }, (_, i) => {
      const criterion = {
        title: data[`${prefix}_criteria${i + 1}_title`],
        highestScore: data[`${prefix}_criteria${i + 1}_highest_score`],
        score: data[`${prefix}_criteria${i + 1}_score`],
      };

      // Only include the criterion if its title is not null or empty
      return criterion.title ? criterion : null;
    }).filter(Boolean); // Remove null values from the array

    // If there are no valid criteria, don't render the table
    if (criteria.length === 0) return null;

    const totalScore = criteria.reduce((acc, criterion) => acc + (criterion.score || 0), 0);
    const totalHighestScore = criteria.reduce((acc, criterion) => acc + (criterion.highestScore || 0), 0);

    return (
      <div key={prefix}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Criteria Title</TableCell>
                <TableCell>Highest Score Possible</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {criteria.map((criterion, index) => (
                <TableRow key={index}>
                  <TableCell>{criterion.title}</TableCell>
                  <TableCell>{criterion.highestScore}</TableCell>
                  <TableCell>{criterion.score}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell>{totalHighestScore}</TableCell>
                <TableCell>{totalScore}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center">Loading...</Typography>
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Subject Data</Typography>

          {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}

          {data && subjectid && idNumber && (
            <div>
              <Typography variant="h6" gutterBottom align="center">
                Subject Data for Subject ID: {subjectid} and Student ID: {idNumber}
              </Typography>

              {/* Render Activity Data for each prefix */}
              {['ORT1', 'ORT2', 'ORT3', 'ORT4', 'ORT5', 'ORT6', 'ORT7', 'ORT8', 'WA1', 'WA2', 'WA3', 'WA4', 'WA5', 'WA6', 'long_test', 'midterm'].map(prefix => renderActivityData(prefix))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
