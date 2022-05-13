import React from "react";
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
} from "./footerstyle";

  
const Footer = () => {
  return (
    <Box>
      <h1 style={{ color: "White", 
                   textAlign: "center", 
                   marginTop: "-50px" }}>
      Car Rental Company
      </h1>
      <Container>
        <Row >
          <Column >
            <Heading>About Us</Heading>
            <FooterLink href="/members"><img src ='/peoplelog.png' alt='logo' width='55px' height='30px'/>Team Members </FooterLink>
          
          </Column>
         
          <Column>
            <Heading>Power by</Heading>
            <FooterLink href="https://reactjs.org/" target="_blank"><img src ='/favicon.ico' alt='logo' width='55px' height='30px'/>React</FooterLink>
            <FooterLink href="https://expressjs.com/" target="_blank"><img src ='/nodelogo.png' alt='logo' width='70px' height='30px'/>Express</FooterLink>
            <FooterLink href="https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_united_states_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624338&adgroup=115749704103&gclid=Cj0KCQjwpcOTBhCZARIsAEAYLuVO5y9axdDNTQ83akODt1fdv_yU-Af3fiwq0pMKtVtp-GTY7bo1aHAaAhkoEALw_wcB" target="_blank">
              <img src ='/mongodb-logo.png' alt='logo' width='70px' height='30px'/>MongoDB</FooterLink>
         
          </Column>
          <Column>
            <Heading>Social Media</Heading>
            <FooterLink href="#">
            <img src ='/facebooklogo.svg' alt='logo' width='50px' height='30px'/>
              <i className="fab fa-facebook-f">
                <span style={{ marginLeft: "10px" }}>
                  Facebook
                </span>
              </i>
            </FooterLink>
            <FooterLink href="#">
            <img src ='/inslogo.png' alt='logo' width='50px' height='30px'/>
              <i className="fab fa-instagram">
                <span style={{ marginLeft: "10px" }}>
                  Instagram
                </span>
              </i>
            </FooterLink>
            
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;