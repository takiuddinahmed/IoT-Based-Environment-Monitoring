import React, {useEffect, useState} from 'react';
import {Container, Table, Button, Row, Col} from 'react-bootstrap';

import moment from 'moment';

import database from './firebase';
import SingleChart from './singleChart';

const ref = database.ref('/data/');



export default function Chart(){
    const [data,setData] = useState([])
    const [filterdData, setFilteredData] = useState([]);
    const [initDateTime, setInitDateTime] = useState(moment().subtract(1,'days').unix())
    const [finalDateTime, setFinalDateTime] = useState(moment().unix())

    const tempGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.temp})
    })

    const humGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.humidity})
    })

    const noiseGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.noise})
    })

    const uvGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.uv})
    })

    const dustGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.dust})
    })

    const coGraphData = filterdData.map((each)=>{
        return({x:(each.timestamp),y:each.co})
    })

    useEffect(()=>{
        ref.on('child_added',(fData)=>{
            const d = fData.val();
            setData(pData=>[...pData,d]);
        })
    },[])

    useEffect(()=>{
        const f = data.filter(d=>d.timestamp >= initDateTime * 1000 && d.timestamp <= finalDateTime*1000);
        setFilteredData(fd=>f);
    }, [data,finalDateTime,initDateTime])



    return(
        <Container className="mt-5">
            <Row>
                
                <Col sm={1}>
                    <label className="mt-1">
                        From :
                    </label>
                    </Col>
                <Col sm={3}>
                    <input 
                        type="datetime-local" 
                        className="form-control"
                        onChange={(e)=>{
                            setInitDateTime(moment(e.target.value, moment.ISO_8601).unix())
                        }} 
                        value={moment.unix(initDateTime).format('YYYY-MM-DDThh:mm')}>

                    </input>
                </Col>
                <Col sm={1}>
                    <label className="mt-1 pl-4">
                    To :
                    </label>
                    </Col>
                <Col sm={3}> 
                    <input 
                        type="datetime-local"  
                        className="form-control"
                        onChange={(e)=>{
                            setFinalDateTime(moment(e.target.value, moment.ISO_8601).unix())
                        }} 
                        value={moment.unix(finalDateTime).format('YYYY-MM-DDThh:mm')}></input>
                </Col>
            </Row>

            <SingleChart
                title="Temperature vs Time graph"
                axisY="Temperature (C)"
                axisX="Time"
                data={tempGraphData}
            />

            <SingleChart
                title="Humidity vs Time graph"
                axisY="Humidity (%)"
                axisX="Time"
                data={humGraphData}
            />

            <SingleChart
                title="Noise vs Time graph"
                axisY="Noise"
                axisX="Time"
                data={noiseGraphData}
            />

            <SingleChart
                title="UV vs Time graph"
                axisY="UV"
                axisX="Time"
                data={uvGraphData}
            />

            <SingleChart
                title="Dust vs Time graph"
                axisY="Dust"
                axisX="Time"
                data={dustGraphData}
            />

            <SingleChart
                title="CO vs Time graph"
                axisY="co"
                axisX="Time"
                data={coGraphData}
            />
        </Container>
    )
}