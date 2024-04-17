import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import WineBarIcon from '@mui/icons-material/WineBar';
import React, { useEffect, useState } from 'react';
import { fetchExpenses, listExpenses } from '../api/api';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [userId,setUserId] = useState("");
  const [expenseCount,setExpenseCount] = useState(0);
  const [currentWeekExpense,setCurrentWeekExpense] = useState({
    coffee:"",
    food:"",
    alcohol:""
  });
  const [categoryAverages,setCategoryAverages] = useState({
    coffee:"",
    food:"",
    alcohol:""
  });
  const [categoryDifferenceStatus,setCategoryDifferenceStatus] = useState({
    coffee:"",
    food:"",
    alcohol:""
  });

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    setUserId(user_id);
    featchData(user_id);
    listData(user_id);
  }, []);

  const listData = async (user_id:any) => {
    try {
      const expenses = await listExpenses(user_id);
      setCurrentWeekExpense(expenses?.current_week_expense);
      const roundedAverages:any = {};
      for (const category in expenses?.categoryAverages) {
        if (expenses?.categoryAverages.hasOwnProperty(category)) {
          roundedAverages[category] = Math.round(expenses?.categoryAverages[category] * 100) / 100;
        }
      }
      setCategoryAverages(roundedAverages);
      setCategoryDifferenceStatus(expenses?.categoryDifferenceStatus);
    } catch (error) {
      console.log('Error list fetching expenses:', error.message);
    }
  };

  const featchData = async (user_id:any) => {
    try {
      const expenses = await fetchExpenses(user_id);
      setExpenseCount(expenses?.data?.length);
    } catch (error) {
      console.log('Error fetching expenses:', error.message);
    }
  };

  const handleAddSubmit = () => {
    router.push('/add-edit');
  };

  const handleEditSubmit = () => {
    router.push('/add-edit?id=' + userId);
  };

  return (
    <Box textAlign="center">
      <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <Grid item>
          <Typography variant="h4" gutterBottom style={{ marginTop:'20px'}}>
            Am I spending too much?
          </Typography>
        </Grid>
        {/* based on expense count show add/edit expense */}
        {userId && <Grid item style={{ marginLeft:'50px'}}>
          {expenseCount<=0 && <Button variant="contained" onClick={handleAddSubmit}>
            Add Expenses
          </Button>}
          {expenseCount>0 && <Button variant="contained" onClick={handleEditSubmit}>
            Edit Expenses
          </Button>}
        </Grid>}
      </Grid>
      {/* list expenses */}
      <Box display="flex" flexDirection="column" alignItems="center">
      <Grid container spacing={2} justifyContent="center" style={{ marginTop:'15px'}}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Coffee
            </Typography>
            <LocalCafeIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Box>{userId && currentWeekExpense?.coffee ? "$ " + currentWeekExpense?.coffee:"$ 0"} / week</Box>
           <Box style={{ color : (userId && categoryDifferenceStatus?.coffee) ? categoryDifferenceStatus?.coffee === "above average"?'red':'green':'green'}}>{(userId && categoryDifferenceStatus?.coffee) ? categoryDifferenceStatus?.coffee === "above average"? <ArrowUpwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />} {userId && categoryAverages?.coffee ? parseFloat(categoryAverages?.coffee) + "%":"0%"} {userId && categoryDifferenceStatus?.coffee ? categoryDifferenceStatus?.coffee :"below average"}</Box>
        </Grid>
        
      </Grid>
      

      <Grid container spacing={2} justifyContent="center" style={{ marginTop:'15px'}}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Alcohol
            </Typography>
            <WineBarIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Box> {userId && currentWeekExpense?.alcohol ? "$ " + currentWeekExpense?.alcohol:"$ 0"} / week</Box>
           <Box style={{ color : (userId && categoryDifferenceStatus?.alcohol) ? categoryDifferenceStatus?.alcohol === "above average"?'red':'green':'green'}}>{(userId && categoryDifferenceStatus?.alcohol) ? categoryDifferenceStatus?.alcohol === "above average"? <ArrowUpwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />} {userId && categoryAverages?.alcohol ? categoryAverages?.alcohol + "%":"0%"} {userId && categoryDifferenceStatus?.alcohol ? categoryDifferenceStatus?.alcohol:"below average"}</Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop:'15px'}}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Food 
            </Typography>
            <FastfoodIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Box> {userId && currentWeekExpense?.food ? "$ " + currentWeekExpense?.food:"$ 0"} / week</Box>
           <Box style={{ color : (userId && categoryDifferenceStatus?.food) ? categoryDifferenceStatus?.food === "above average"?'red':'green':'green'}}>{(userId && categoryDifferenceStatus?.food) ? categoryDifferenceStatus?.food === "above average"? <ArrowUpwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />:<ArrowDownwardIcon fontSize="small" />} {userId && categoryAverages?.food ? categoryAverages?.food + "%":"0%"} {userId && categoryDifferenceStatus?.food ? categoryDifferenceStatus?.food :"below average"}</Box>
        </Grid>
      </Grid>
      
    </Box>
    </Box>
  );
};

export default HomePage;
