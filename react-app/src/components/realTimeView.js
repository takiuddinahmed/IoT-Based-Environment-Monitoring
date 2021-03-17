import React, {useEffect, useState} from 'react';
import {Container, Table} from 'react-bootstrap';
import moment from 'moment';
import database from './firebase';

const ref = database.ref('/data/');



export default function RealTimeView(){
    const [data,setData] = useState({});
    const [status, setStatus] = useState({});


    useEffect(()=>{
        ref.on('child_added',(fData)=>{
            const d = fData.val();
            // console.log(d)
            setData(pData=>d);
        })
    },[])

    useEffect(()=>{
        const s = {}
        if (data?.temp >= 18.3 && data?.temp <=21.11) {s.tempText = "Good"; s.tempSstyle = "primary"}
        else if (data?.temp >= 4 && data?.temp <=35) {s.tempText = "Tolerable"; s.tempStyle = "primary"}
        else {s.tempText = "Unsafe"; s.tempStyle = "danger"}

        

        setStatus(ps=>s)
    },[data])
    

    return(
        <Container className="mt-5">
            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Ideal Range</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Temperature</td>
                        <td>{data?.temp}  &deg;C</td>
                        <td>18.3°C to 21.11°C (Ideal) <br/>
                            4°C to 35°C (Survivable)
                        </td>
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td>{data?.humidity} %</td>
                        <td>30-70%</td>
                    </tr>
                    <tr>
                        <td>Noise</td>
                        <td>{data?.noise} dB</td>
                        <td> {'<'}85 dB</td>
                    </tr>
                    <tr>
                        <td>UV Ray</td>
                        <td>{data?.uv} mW/cm<sup>2</sup></td>
                        <td> 0-5</td>
                    </tr>
                    <tr>
                        <td>Dust</td>
                        <td>{data?.dust} ug/m<sup>3</sup></td>
                        <td>    0-35.4 ug/m<sup>3</sup></td>
                    </tr>
                    <tr>
                        <td>CO</td>
                        <td>{data?.co} ppm</td>
                        <td>{'<'}50 ppm</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}