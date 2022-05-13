import React, { useState, useEffect, useContext, useRef } from "react";
import Default from "../components/Default";
import { AuthContext } from "../components/authContext";
import { useHistory } from "react-router-dom";
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import "./Profile.css";
import axios from "axios";
import moment from "moment";
const getUserInfo = (_id,setUser)=>{
  axios({
    method: "get",
    url: "http://localhost:5000/profile",
    params:{
      _id,
    }
  })
    .then((res) => {
      const expDateStr =  String(res.data.expDate).slice(0,10)
      res.data.expDate = expDateStr.replace(/-/g,'')
      localStorage.setItem("userInfo",JSON.stringify(res.data))
      setUser({
        ...res.data,
        expDateStr
      })
    })
    .catch((err) => {
      console.log(err);
    });
}
// 获取所有车辆列表
const getCarlist = () => {
  return axios({
    method: "get",
    url: "http://localhost:5000/Carlist",
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export default function Profile() {
  const { auth, setAuth } = useContext(AuthContext);
  let history = useHistory();
  const formRef = useRef(null);
  const info = JSON.parse(localStorage.getItem("userInfo")) || {};
  const expDate = String(info.expDate).slice(0, 10).replace(/-/g,'');
  const expDateStr = 
    expDate.slice(0, 4) + "-" + expDate.slice(4, 6) + "-" + expDate.slice(-2);
  const [userInfo, setUserInfo] = useState({
    ...info,
    expDateStr,
    expDate: moment(expDateStr, "YYYY-MM-DD"),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    // {
    //   title: "Car Id",
    //   dataIndex: "car",
    //   key: "car",
    // },
    {
      title: "Car Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "Order Created Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
  ];

  const handleOk = () => {
    formRef.current.validateFields().then((res) => {
      const req = {
        ...res,
        expDate: res.expDate.format("YYYY-MM-DD"),
        _id:userInfo._id
      };
      setIsModalVisible(false);
      axios({
        method: "put",
        url: "http://localhost:5000/profile",
        data: req,
      })
        .then(() => {
          message.success("Updated Successfully");
          getUserInfo(info._id,setUserInfo)
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const onCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = () => {};
  const getValueFromEvent = (e) => {
    let { value } = e.target;
    // const reg = /^\d+$/;
    // if (!reg.test(value.trim())) {
    //   return "";
    // }
    return value;
  };
  useEffect(() => {
    if (auth === false) {
      history.push("/");
    }
    Promise.all([getCarlist(),axios({
      method: "get",
      url: "http://localhost:5000/allbookings",
      params: {
        // 获取自己的订单列表
        userId: userInfo._id,
      },
    })]).then(([carList,res]) => {
      const map = {}
      carList.forEach((car)=>{
        map[car._id] = car
      })
      const list = res.data.filter((item) => {
        return item.user === userInfo._id;
      });
      setDataSource(
        list.map((item, index) => {
          item.key = index;
          return {
            ...item,
            key: index,
            name: map[item.car].name,
          };
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });
    
     
  }, []);
  return (
    <Default>
      <div className="contain">
        <h2>Account Information</h2>
        <Row className="info-wrap">
          <Col span={6}>
            <span>username：</span>
            {userInfo.username}
          </Col>
          <Col span={6}>
            <span>password：</span>
            {userInfo.password}
          </Col>
          <Col span={6}>
            <span>fullName：</span>
            {userInfo.fullName}
          </Col>
          <Col span={6}>
            <span>email：</span>
            {userInfo.email}
          </Col>
        </Row>
        <Row className="info-wrap">
          <Col span={6}>
            <span>age：</span>
            {userInfo.age}
          </Col>
          <Col span={6}>
            <span>phone：</span>
            {userInfo.phone}
          </Col>
          <Col span={6}>
            <span>driver license：</span>
            {userInfo.driverLicense}
          </Col>
          <Col span={6}>
            <span>expiration date：</span>
            {userInfo.expDateStr}
          </Col>
        </Row>
        <Row>
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            Edit account information
          </Button>
        </Row>
        <h3>My Orders</h3>
        <Table dataSource={dataSource} columns={columns} />
      </div>
      <Modal
        title="Edit account information"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={userInfo}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="username"
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="password："
            name="password"
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter password!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="fullName："
            name="fullName"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter fullName!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="email："
            name="email"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter email!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="age："
            name="age"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter age!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="phone："
            name="phone"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter phone!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="driver license："
            name="driverLicense"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter driver license!" }]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="expiration date："
            name="expDate"
            rules={[{ required: true, message: "Please enter expiration date!" }]}
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
        </Form>
      </Modal>
    </Default>
  );
}
