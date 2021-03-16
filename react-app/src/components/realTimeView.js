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
                        {/* <th>Status</th> */}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Temperature</td>
                        <td>{data?.temp}  &deg;C</td>
                        {/* <td className={`text-${status?.tempStyle}`}>{status.tempText}</td> */}
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td>{data?.humidity} %</td>
                    </tr>
                    <tr>
                        <td>Noise</td>
                        <td>{data?.noise} dB</td>
                    </tr>
                    <tr>
                        <td>UV Ray</td>
                        <td>{data?.uv} mW/cm<sup>2</sup></td>
                    </tr>
                    <tr>
                        <td>Dust</td>
                        <td>{data?.dust} ug/m<sup>3</sup></td>
                    </tr>
                    <tr>
                        <td>CO</td>
                        <td>{data?.co} ppm</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}