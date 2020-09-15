import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import {Container as ContainerBase } from "components/misc/Layouts.js"
import logo from "../../images/helpo.svg";
import { ReactComponent as FacebookIcon } from "../../images/facebook-icon.svg";
import { ReactComponent as WhatsAppIcon } from "../../images/whatsapp-icon.svg";
import { ReactComponent as InstagramIcon } from "../../images/instagram-icon.svg";
import { ReactComponent as MediumIcon } from "../../images/medium-icon.svg";
import { ReactComponent as MailIcon } from "feather-icons/dist/icons/mail.svg";


const Container = tw(ContainerBase)`bg-gray-900 text-gray-100 -mx-8 -mb-8`
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const Row = tw.div`flex items-center justify-center flex-col px-8`

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-2xl font-black tracking-wider`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`
export default () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>Helpo</LogoText>
          </LogoContainer>
          <SocialLinksContainer>
            <SocialLink href="https://fb.me/helpo.oficial">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://api.whatsapp.com/send?phone=5493517507784&text=¡Hola%20Helpo!">
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/helpo.oficial">
              <InstagramIcon />
            </SocialLink>
            <SocialLink href="https://medium.com/@helpo">
              <MediumIcon />
            </SocialLink>
            <SocialLink href="mailto:consultas@helpo.com.ar">
              <MailIcon />
            </SocialLink>
          </SocialLinksContainer>
          <CopyrightText>
            &copy; Copyright 2020, Helpo.
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};
