'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function SubjectPage() {
  const { idNumber, subjectid } = useParams();
  const [data, setData] = useState(null);
  const [grades, setGrades] = useState(null);
  const [highestScores, setHighestScores] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { 
    if (subjectid && idNumber) {
      setIsLoading(true);
      fetchSubjectData(subjectid);
      fetchHighestScoreData(subjectid);
      fetchGrades(subjectid, idNumber);
    }
  }, [subjectid, idNumber]);

  const fetchGrades = async (subjectId, idNumber) => {
    try {
      const response = await fetch('/api/student/grades/college/fetch-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, idNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setGrades(result.grades || {});
        setError('');
      } else {
        setGrades({});
        setError(result.error || 'Failed to fetch grades');
      }
    } catch (err) {
      setGrades({});
      setError('An error occurred while fetching grades');
    }
  };

  const fetchSubjectData = async (subjectId) => {
    try {
      const response = await fetch('/api/student/grades/college/fetch-criteria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectid: subjectId }),
      });

      const result = await response.json();

      if (response.ok) {
        setData(result.data || {});
        setError('');
      } else {
        setData({});
        setError(result.error || 'Failed to fetch subject data');
      }
    } catch (err) {
      setData({});
      setError('An error occurred while fetching subject data');
    }
  };

  const fetchHighestScoreData = async (subjectId) => {
    try {
      const response = await fetch('/api/student/grades/college/fetch-highest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectid: subjectId }),
      });

      const result = await response.json();

      if (response.ok) {
        setHighestScores(result.data || []);
        setError('');
      } else {
        setHighestScores([]);
        setError(result.error || 'Failed to fetch highest scores');
      }
    } catch (err) {
      setHighestScores([]);
      setError('An error occurred while fetching highest scores');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActivityData = (prefix) => {
    if (!data || !highestScores || !grades) return null;

    const title = data[`${prefix}_Title`];
    if (!title) return null; // Skip if no activity title exists

    const criteria = Array.from({ length: 5 }, (_, i) => {
      const criterion = {
        title: data[`${prefix}_criteria${i + 1}_title`],
        highestScore: highestScores[0]?.[`${prefix}_criteria${i + 1}_highest_score`] || 0,
        score: grades[`${prefix}_criteria${i + 1}_score`] || 0,
      };
      return criterion.title ? criterion : null; // Only include criteria if the title exists
    }).filter(Boolean);

    const totalScore = criteria.reduce((sum, c) => sum + (c.score || 0), 0);
    const totalHighestScore = criteria.reduce((sum, c) => sum + (c.highestScore || 0), 0);

    return { title, criteria, totalScore, totalHighestScore };
  };

  const activityGroups = {
    'OBE Related Tasks': ['ORT1', 'ORT2', 'ORT3', 'ORT4', 'ORT5', 'ORT6', 'ORT7', 'ORT8'],
    'Written Assessment': ['WA1', 'WA2', 'WA3', 'WA4', 'WA5', 'WA6'],
    'Long Test': ['long_test'],
    'Midterms/Finals': ['midterm'],
  };

  const calculateTotalScores = () => {
    const components = [
      { name: 'OBE Related Tasks', prefixes: ['ORT1', 'ORT2', 'ORT3', 'ORT4', 'ORT5', 'ORT6', 'ORT7', 'ORT8'] },
      { name: 'Written Assessment', prefixes: ['WA1', 'WA2', 'WA3', 'WA4', 'WA5', 'WA6'] },
      { name: 'Long Test', prefixes: ['long_test'] },
      { name: 'Midterms/Finals', prefixes: ['midterm'] },
    ];

    return components.map((component) => {
      const totalScore = component.prefixes.reduce((total, prefix) => {
        const activityData = renderActivityData(prefix);
        return total + (activityData ? activityData.totalScore : 0);
      }, 0);

      return { ...component, totalScore };
    });
  };

  const calculateTotalHighestScores = () => {
    const components = [
      { name: 'OBE Related Tasks', prefixes: ['ORT1', 'ORT2', 'ORT3', 'ORT4', 'ORT5', 'ORT6', 'ORT7', 'ORT8'] },
      { name: 'Written Assessment', prefixes: ['WA1', 'WA2', 'WA3', 'WA4', 'WA5', 'WA6'] },
      { name: 'Long Test', prefixes: ['long_test'] },
      { name: 'Midterms/Finals', prefixes: ['midterm'] },
    ];

    return components.map((component) => {
      const totalHighestScore = component.prefixes.reduce((total, prefix) => {
        const activityData = renderActivityData(prefix);
        return total + (activityData ? activityData.totalHighestScore : 0);
      }, 0);

      return { ...component, totalHighestScore };
    });
  };

  const totalScores = calculateTotalScores();
  const totalHighestScores = calculateTotalHighestScores();

  if (isLoading) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-between items-center">
        <span className="text-lg font-bold">📚 Subject Details</span>
        <button onClick={() => router.push('/')} className="text-white underline">
          Log off
        </button>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto py-8 px-6 flex flex-wrap lg:flex-nowrap gap-6">
        {/* Main Table Area */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-4">📘 Subject Data</h1>
          <p className="text-gray-700 mb-4">
            Below is the detailed information for the selected subject.
          </p>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-6 p-4 rounded-lg shadow-lg">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {data && subjectid && idNumber && (
            <div>
              <Typography variant="h6" gutterBottom align="center">
                Subject Data for Subject ID: {subjectid} and Student ID: {idNumber}
              </Typography>

              {/* Render Activity Data for each group */}
              {Object.entries(activityGroups).map(([groupName, prefixes]) => {
                const activities = prefixes.map(renderActivityData).filter(Boolean);
                if (activities.length === 0) return null;

                return (
                  <Card key={groupName} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="h5">{groupName}</Typography>
                      {activities.map(({ title, criteria, totalScore, totalHighestScore }, index) => (
                        <div key={index}>
                          <Typography variant="h6">{title}</Typography>
                          <TableContainer component={Paper}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Criteria</TableCell>
                                  <TableCell>Highest Possible</TableCell>
                                  <TableCell>Your Score</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {criteria.map((c, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{c.title}</TableCell>
                                    <TableCell>{c.highestScore}</TableCell>
                                    <TableCell>{c.score}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell>
                                    <strong>Total</strong>
                                  </TableCell>
                                  <TableCell>{totalHighestScore}</TableCell>
                                  <TableCell>{totalScore}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Grand Total Card */}
        <div className="w-full lg:w-1/3 sticky top-0">
        <Card sx={{ position: 'sticky', top: 20, zIndex: 1000 }}>
  <CardContent>
    <Typography variant="h6" align="center" gutterBottom>
      Grand Total
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Components</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Highest Possible Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalScores.map((component, index) => (
            <TableRow key={index}>
              <TableCell>{component.name}</TableCell>
              <TableCell>{component.totalScore}</TableCell>
              <TableCell>{totalHighestScores[index]?.totalHighestScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </CardContent>
</Card>
        </div>
      </div>
    </div>
  );
}
