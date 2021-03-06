import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const AvatarMin = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  object-fit: cover;
  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const UserWrapper = styled.div`
  height: 70px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
`;

const User = styled.span`
  text-align: left;
  color: #000000;
`;

const Time = styled.span`
  color: #515151;
`;

type Props = {
  avatar: string | undefined;
  firstName: string;
  lastName: string;
  date: string;
};

const UserInfo = ({ avatar, firstName, lastName, date }: Props): JSX.Element => (
  <Container>
    <AvatarMin src={avatar} alt="Aватар" />
    <UserWrapper>
      <User>{`${firstName} ${lastName}`}</User>
      <Time>{format(new Date(date), "dd.MM.yyyy' в 'HH:mm")}</Time>
    </UserWrapper>
  </Container>
);

export default UserInfo;
