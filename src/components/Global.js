import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CountUp from 'react-countup';
import { Graphs } from './Graphs';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    paper: {
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minHeight: 130.53,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textTransform: 'capitalize',
        color: 'rgb(58, 112, 163)'
    }
}));
export default function Global() {
            const classes = useStyles();
    const [globalData, setGlobalData] = useState({});
    useEffect(() => {
        async function fetchData() {
            const fetched = await fetch('https://corona.lmao.ninja/v2/all?yesterday');
            const data = await fetched.json();
            delete data.updated;
            delete data.casesPerOneMillion;
            delete data.deathsPerOneMillion;
            delete data.tests;
            delete data.population;
            delete data.oneCasePerPeople;
            delete data.oneDeathPerPeople;
            delete data.oneTestPerPeople;
            delete data.activePerOneMillion;
            delete data.recoveredPerOneMillion;
            delete data.testsPerOneMillion;
            delete data.criticalPerOneMillion;
            delete data.affectedCountries;
            setGlobalData(data);
        }
        fetchData();
    }, [])

    return (
        <div className={classes.root}>
            {globalData['cases'] ? (
                <div>
                    <a href='#graph'>View Graph</a>
                    <Grid container spacing={3}>
                        {Object.keys(globalData).map((key, ind) => {
                            return (
                                <Grid item xs={6} sm={4} md={3} key={ind}>
                                    <Paper
                                        className={classes.paper}
                                        elevation={3}>
                                        <h4 className={classes.title}>
                                            {key.replace(/_/g, ' ')}
                                        </h4>
                                        <CountUp className='numbers' start={0} end={globalData[key]} separator=',' duration={2} />
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <span id='graph'>
                        <Graphs />
                    </span>
                </div>
            ) : <p className='country-load'> Loading...</p>}
        </div>
    );
}