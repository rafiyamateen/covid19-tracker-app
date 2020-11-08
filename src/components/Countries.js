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
            const fetched = await fetch('https://corona.lmao.ninja/v2/countries?yesterday&sort');
            const data = await fetched.json();
            setCountriesData(data);
        }
        fetchData()
    }, [])
    const [matchFound, setMatchFound] = useState(true);
    const searchCountry = (e) => {
        setMatchFound(false);
        let searchValue = document.getElementsByTagName('input')[0].value.toLowerCase();
        for (let i = 0; i < countriesData.length; i++) {
            if (countriesData[i]) {
                if (countriesData[i].country.toLowerCase().indexOf(searchValue) !== -1) {
                    document.getElementsByClassName('tableRow')[i].style.display = '';
                    setMatchFound(true);
                }
                else {
                    document.getElementsByClassName('tableRow')[i].style.display = 'none';
                }
            }
        }
    }
    const [selection, setSelection] = useState();
    function selectCountry(e) {
        let country = (e.target.value);
        for (let i = 0; i < countriesData.length; i++) {
            if (countriesData[i]) {
                if (country === countriesData[i].country) {
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
                        data: [selection.cases, selection.recovered, selection.deaths]
                    }]
                }}
                options={{
                    legend: { display: false },
                    title: { display: true, text: `Current state in ${selection ? selection.country : 'Pakistan'}` }
                }}
            />
        ) : <p className='select-country'>Select country to view the graph</p>
    )
    return (
        <div>
            {countriesData[0].country ? (
                <div>
                    <div className='flex'>
                        <div className='searchCountry'>
                            <SearchIcon className='searchIcon' />
                            <input type='search' placeholder='Search Country...' onChange={searchCountry} className='searchInput' />
                        </div>
                        <a className='viewGraphs' href='#graph'>View Graphs</a>
                    </div>
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
                                                    {countriesData[ind].country}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].cases} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].deaths} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].recovered} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell className={countriesData[ind].todayCases !== 0 ? 'new-cases' : 'color-black'} align="right">
                                                    <NumberFormat value={countriesData[ind].todayCases} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell className={countriesData[ind].todayDeaths !== 0 ? 'new-deaths' : 'color-black'} align="right">
                                                    <NumberFormat value={countriesData[ind].todayDeaths} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].critical} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat value={countriesData[ind].active} displayType={'text'} thousandSeparator={true} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {!matchFound &&
                                        <TableRow>
                                            <TableCell colSpan="9" className="no_match" >
                                                No matching records found
                                                </TableCell>
                                        </TableRow>}
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
                                        <MenuItem key={ind} value={countriesData[ind].country}>{countriesData[ind].country && countriesData[ind].country}</MenuItem>
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