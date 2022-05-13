import React, { useEffect, useContext, useState } from "react";
import Default from "../components/Default";
import { AuthContext } from "../components/authContext";
import { useHistory, NavLink } from "react-router-dom";
import { Container } from "@mui/material";
import "./CarList.css";
import "animate.css";
import axios from "axios";
import { Col, Row, Divider, DatePicker, Checkbox, message } from "antd";
import {Button, Card} from 'react-bootstrap';
export default function CarList() {
  const { auth, setAuth } = useContext(AuthContext);
  let history = useHistory();
  const [carlist1, setCarlist] = useState([]);
  const userInfo = JSON.parse( localStorage.getItem('userInfo'))
  useEffect(() => {
    if (auth === false) {
      history.push("/");
    }
    axios({
      method: "get",
      url: "http://localhost:5000/CarList",
    })
      .then((res) => {
        setCarlist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const gotoBooking = (car) => {
    return (e) => {
      if(userInfo.isCarOwner){
        message.warning('you are carOwner')
        return
      }
      history.push({ pathname: `/bookingcar`, state: car });
    };
  };
  return (
    <Default>
      <h1 className="animate__animated animate__bounce p-5">
        {" "}
        <span className="span1">Enjoy your journey with our luxury cars </span>
      </h1>
      <Container maxWidth="lg">
   
        <Row justify="center" gutter={16}>
          {carlist1.map((car) => {
            return (
              <Col lg={5} sm={24} xs={24} key={car._id}>
                <Card style={{ width: '15rem', backgroundColor:'#3D3D3D'}}>
                <div className="car p-2 bs1">
                  <img src={car.image} className="carimg" />

                  <div className="car-content d-flex align-items-center justify-content-between">
                    <div className="text-left pl-2">
                      <p className="carname">{car.name} {car.rentPerHour}</p>
                      
                    </div>
                    <Button className="booking-btn" variant="outline-secondary"  onClick={gotoBooking(car)}>
                      booking
                    </Button>
                  </div>
                </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Default>
  );
}
