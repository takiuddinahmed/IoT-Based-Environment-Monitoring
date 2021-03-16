import React, {useEffect, useState} from 'react';
import {Container, Table, Row,Col, Button} from 'react-bootstrap';
import CsvDownloader from 'react-csv-downloader'

import moment from 'moment';

import database from './firebase';
const ref = database.ref('/data/');



export default function DataTable(){
    const [data,setData] = useState([])
    const [filterdData, setFilteredData] = useState([]);
    const [initDateTime, setInitDateTime] = useState(moment().subtract(1,'days').unix())
    const [finalDateTime, setFinalDateTime] = useState(moment().unix())

    const csvHead = [{
    id: 'time',
    displayName: 'Time',
    }, 
    {id: 'temp',displayName: 'Temperature',},
    {id: 'humidity',displayName: 'Humidity',},
    {id: 'noise',displayName: 'Noise',},
    {id: 'uv',displayName: 'UV',},
    {id: 'dust',displayName: 'Dust',},
    {id: 'co',displayName: 'CO',},
];

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

    const dataView = filterdData.map(each=>{
        return(
            <tr key={each?.timestamp}>
                <td>{moment(each?.timestamp).format('DD MMM YYYY    hh:mm:ss')}</td>
                <td>{each?.temp}</td>
                <td>{each?.humidity}</td>
                <td>{each?.noise}</td>
                <td>{each?.uv}</td>
                <td>{each?.dust}</td>
                <td>{each?.co}</td>
            </tr>
        )
    })

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
                <Col sm={3} >
                        <CsvDownloader 
                        columns={csvHead}
                        datas={filterdData.map(e=>{
                            e.time = moment(e.timestamp).format('DD MMM YYYY hh:mm:ss');
                            return e
                        })}
                        filename="exportData"
                        
                        >
                            <Button
                                variant="outline-primary"
                                className="ml-4"
                            >

                                Export Data
                            </Button>
                        </CsvDownloader>
                </Col>
            </Row>
            <Table striped bordered hover className="text-center mt-5">
                <thead>
                    <tr>
                        <th>Date-Time </th>
                        <th>Temperature(&deg;C)</th>
                        <th>Humidity (%)</th>
                        <th>Noise (dB)</th>
                        <th>UV Ray (mW/cm<sup>2</sup>)</th>
                        <th>Dust (ug/m<sup>3</sup>)</th>
                        <th>CO (ppm)</th>
                    </tr>
                </thead>
                <tbody>
                    {dataView}
                </tbody>
            </Table>
        </Container>
    )
}