import React, { useState, useEffect, useContext, useRef } from "react";
import Default from "../components/Default";
import { AuthContext } from "../components/authContext";
import { useHistory } from "react-router-dom";
import {
  message,
  Table,
  Row,
  Col,

  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import "./OwnerProfile.css";
import axios from "axios";
import moment from "moment";
import {Button, Card} from 'react-bootstrap';
const getUserInfo = (_id, setUser) => {
  axios({
    method: "get",
    url: "http://localhost:5000/profile",
    params: {
      _id,
    },
  })
    .then((res) => {
      const expDateStr = String(res.data.expDate).slice(0, 10);
      res.data.expDate = expDateStr.replace(/-/g, "");
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setUser({
        ...res.data,
        expDateStr,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// get all carlist
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
  const info = JSON.parse(localStorage.getItem("userInfo")) || {};
  const formRef = useRef(null);
  const formCarRef = useRef(null);

  const expDate = String(info.expDate).slice(0, 10).replace(/-/g, "");
  const expDateStr =
    expDate.slice(0, 4) + "-" + expDate.slice(4, 6) + "-" + expDate.slice(-2);
  const [userInfo, setUserInfo] = useState({
    ...info,
    expDateStr,
    expDate: moment(expDateStr, "YYYY-MM-DD"),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myCarList, setMyCarList] = useState([]);
  const [rentList, setRentList] = useState([]);
  const [currentCar, setCurrentCar] = useState({});
  const [isCarDialogShow, setIsCarDialogShow] = useState(false);

  const columns = [
    // {
    //   title: "Car id",
    //   dataIndex: "Car",
    //   key: "car",
    // },
    {
      title: "Car name",
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
  const carColumns = [
    {
      title: "Car name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "rentPerHour",
      key: "rentPerHour",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <a
            href="#"
            style={{ marginRight: "30px" }}
            onClick={onEditCar(record)}
          >
            Edit
          </a>
          <a href="#" onClick={onDelCarItem(record)}>
            Delete
          </a>
        </div>
      ),
    },
  ];
  const onAddCar = () => {
    const obj = {
      name: "",
      image: "",
      rentPerHour: "",
    };
    setCurrentCar(obj);
    setIsCarDialogShow(true);
    setTimeout(()=>{
      formCarRef.current.setFieldsValue(obj);
    },20)
  };
  const onEditCar = (record) => {
    return () => {
      setCurrentCar({
        ...record,
      });
      setIsCarDialogShow(true);
      setTimeout(() => {
        formCarRef.current.setFieldsValue({
          ...record,
        });
      }, 5);
    };
  };
  const onDelCarItem = (record) => {
    return () => {
      Modal.confirm({
        title: "Do you want to delete this car?",
        content: "Once you delete the car, you need to add tham again!",
        onOk() {
          console.log(111, record);
          axios({
            method: "post",
            url: "http://localhost:5000/deletecar",
            data: {
              carid: record._id,
            },
          })
            .then((res) => {
              getTwoList();
              message.success("Deleted sucessfully");
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {},
      });
    };
  };
  const handleOk = () => {
    formRef.current.validateFields().then((res) => {
      const req = {
        ...res,
        expDate: res.expDate.format("YYYY-MM-DD"),
        _id: userInfo._id,
      };
      console.log(req);
      setIsModalVisible(false);
      axios({
        method: "put",
        url: "http://localhost:5000/profile",
        data: req,
      })
        .then(() => {
          message.success("Updated sucessfully");
          getUserInfo(info._id, setUserInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const onCancel = () => {
    setIsModalVisible(false);
    setIsCarDialogShow(false);
  };
  const onHandleCarOk = () => {
    formCarRef.current.validateFields().then((res) => {
      console.log(res, currentCar);
      let url = "/addcar";
      if (currentCar._id) {
        url = "/editcar";
      }
      const req = { ...currentCar, ...res, carOwner: userInfo.email };
      axios({
        method: "post",
        url: "http://localhost:5000" + url,
        data: req,
      })
        .then((res) => {
          getTwoList();
          setIsCarDialogShow(false);
          message.success(currentCar._id ? "Updated Successfully" : "Added Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const onFinish = () => {};
  const getValueFromEvent = (e) => {
    let { value } = e.target;
    return value;
  };
  const getTwoList = () => {
    getCarlist()
      .then((carList) => {
        const obj = {};
        const list = carList
          .filter((item) => {
            return item.carOwner === userInfo.email;
          })
          .map((item, index) => {
            item.key = index;
            obj[item._id] = item;
            return { ...item };
          });
        setMyCarList(list);
        return obj;
      })
      .then((map) => {
        axios({
          method: "get",
          url: "http://localhost:5000/allbookings",
          params: {
            // get my order list
            // userId: userInfo._id,
          },
        })
          .then((res) => {
            const list = [];
            res.data.forEach((item, index) => {
              if (map[item.car]) {
                list.push({
                  ...item,
                  key: index,
                  name: map[item.car].name,
                });
              }
            });
            setRentList(list);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  };
  useEffect(() => {
    if (auth === false) {
      history.push("/");
    }
    getTwoList();
  }, []);
  return (
    <Default>
      <div className="contain">
        <h2 className="account">
          Account Information{" "}
          <Button
            className="add-btn p-2"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            Edit account information
          </Button>
        </h2>
        <Row className="info-wrap">
          <Col span={6}>
            <span>Username：</span>
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
        <h3 className="account">
          My Cars{" "}
          <Button onClick={onAddCar} className="add-btn float-right mb-2">
           + Add new car
          </Button>
        </h3>
        <Table dataSource={myCarList} columns={carColumns} />
        <h3 className="account">Past order</h3>
        <Table dataSource={rentList} columns={columns} />
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
          {/* <Form.Item
            label="fullName："
            name="fullName"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter fullName!" }]}
          >
            <Input maxLength={16} />
          </Form.Item> */}
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
          {/* <Form.Item
            label="driver license："
            name="driverLicense"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter driver license!" }]}
          >
            <Input maxLength={16} />
          </Form.Item> */}
          <Form.Item
            label="expiration date："
            name="expDate"
            rules={[{ required: true, message: "Please enter expiration date!" }]}
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={currentCar._id ? "Edit car information" : "Add new car"}
        visible={isCarDialogShow}
        onOk={onHandleCarOk}
        onCancel={onCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={currentCar}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formCarRef}
        >
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: "Please enter car name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="image："
            name="image"
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter image URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="rentPerHour："
            name="rentPerHour"
            required
            getValueFromEvent={getValueFromEvent}
            rules={[{ required: true, message: "Please enter rentPerHour!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Default>
  );
}
