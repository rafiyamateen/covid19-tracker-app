import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format';
import { Select, FormControl, MenuItem, makeStyles, InputLabel } from '@material-ui/core'
import { Bar } from 'react-chartjs-2';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const tableStyles = makeStyles({
    table: {
        minWidth: 800,
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 600,
    },
});
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export function Countries() {
    const classes = useStyles();
    const tableClasses = tableStyles();
    const [countriesData, setCountriesData] = useState([{}])
    useEffect(() => {
        async function fetchData() {
            const fetched = await fetch('https://api.thevirustracker.com/free-api?countryTotals=ALL');
            const data = await fetched.json();
            const changedData = Object.values(Object.values(data.countryitems)[0]);
            delete changedData[182];
            setCountriesData(changedData);
        }
        fetchData()
    }, [])
    const searchCountry = (e) => {
        let searchValue = document.getElementsByTagName('input')[0].value.toLowerCase();
        for (let i = 0; i < countriesData.length; i++) {
            if (countriesData[i]) {
                if (countriesData[i].title.toLowerCase().indexOf(searchValue) === -1) {
                    document.getElementsByClassName('tableRow')[i].style.display = 'none';
                }
                else {
                    document.getElementsByClassName('tableRow')[i].style.display = '';
                }
            }
        }
    }
    const [selection, setSelection] = useState();
    function selectCountry(e) {
        let country = (e.target.value);
        for (let i = 0; i < countriesData.length; i++) {
            if (countriesData[i]) {
                if (country === countriesData[i].title) {
                    setSelection(countriesData[i]);
                }
            }
        }
    }
    const barChart = (
        selection ? (
            <Bar
                data={{
                    labels: ['Infected', 'Recovered', 'Deaths'],
                    datasets: [{
                        label: 'People',
                        backgroundColor: [
                            '#3333ff', 'green', 'red',
                        ],
                        data: [selection.total_cases, selection.total_recovered, selection.total_deaths]
                    }]
                }}
                options={{
                    legend: { display: false },
                    title: { display: true, text: `Current state in ${selection ? selection.title : 'Pakistan'}` }
                }}
            />
        ) : <p className='select-country'>Select country to view the graph</p>
    )
    return (
        <div>
            {countriesData[0].title ? (
                <div>
                    <div className='searchCountry'>
                        <SearchIcon className='searchIcon' />
                        <input type='search' placeholder='Search Country...' onChange={searchCountry} className='searchInput' />
                    </div>
                    <a href='#graph'>View Graphs</a>

                    <Paper className={tableClasses.root}>
                        <TableContainer className={tableClasses.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead className='table-head'>
                                    <TableRow className='table-head'>
                                        <TableCell className='table-head'>#</TableCell>
                                        <TableCell className='table-head'>COUNTRY</TableCell>
                                        <TableCell className='table-head' align="right">TOTAL CASES</TableCell>
                                        <TableCell className='table-head' align="right">TOTAL DEATHS</TableCell>
                                        <TableCell className='table-head' align="right">TOTAL RECOVERED</TableCell>
                                        <TableCell className='table-head' align="right">NEW CASES</TableCell>
                                        <TableCell className='table-head' align="right">NEW DEATHS</TableCell>
                                        <TableCell className='table-head' align="right">ACTIVE CASES</TableCell>
                                        <TableCell className='table-head' align="right">SERIOUS CASES</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {countriesData.map((val, ind) => {
                                        return (
                                            <TableRow className='tableRow' hover role="checkbox" tabIndex={-1} key={ind}>
                                                <TableCell component="th" scope="row">
                                                    {ind + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {countriesData[ind].title}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].total_cases} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].total_deaths} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].total_recovered} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell className={countriesData[ind].total_new_cases_today!==0?'new-cases':null} align="right">
                                                    <NumberFormat className='color-white' value={countriesData[ind].total_new_cases_today} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell className={countriesData[ind].total_new_deaths_today!==0?'new-deaths':null} align="right">
                                                    <NumberFormat className='color-white' value={countriesData[ind].total_new_deaths_today} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].total_active_cases} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].total_serious_cases} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <div className='graph-section'>
                        <FormControl className={classes.formControl} id='graph'>
                            <InputLabel id="countryList">Select Country</InputLabel>
                            <Select labelId='countryList' defaultValue='' onChange={(e) => { selectCountry(e) }}>
                                {countriesData.map((key, ind) => {
                                    return (
                                        <MenuItem key={ind} value={countriesData[ind].title}>{countriesData[ind].title && countriesData[ind].title}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        {barChart}
                    </div>
                </div >
            ) : <p className='country-load'> Loading...</p>}
        </div>
    )
}