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
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textTransform: 'uppercase',
        color: 'rgb(58, 112, 163)'
    }
}));
export default function Global() {
    const classes = useStyles();
    const [globalData, setGlobalData] = useState({});
    useEffect(() => {
        async function fetchData() {
            const fetched = await fetch('https://api.thevirustracker.com/free-api?global=stats');
            const data = await fetched.json();
            delete data.results[0].source;
            delete data.results[0].total_unresolved;
            setGlobalData(data.results[0]);
        }
        fetchData();
    }, [])

    return (
        <div className={classes.root}>
            {globalData['total_cases'] ? (
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