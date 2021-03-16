import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom'

export default function NavBar(){
    return (
    <Navbar bg="dark" variant="dark" collapseOnSelect  expand="lg" className="stiky">
        <Navbar.Brand href="#home">
        {/* <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
        />{' '} */}
            IoT Enveronment Monitoring System
        </Navbar.Brand>

        
        <Navbar.Toggle />


        <Navbar.Collapse>
            <Nav className="mr-auto">
                <Nav.Item>
                    <Nav.Link eventKey="1" as={Link}  to="/">
                        Home
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="2" as={Link} to="/datatable">
                        Data Table
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="3" as={Link} to="/chart">
                        Chart
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar.Collapse>


    </Navbar>
    )
}