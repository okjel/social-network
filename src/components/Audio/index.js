import React from 'react';
import styled from 'styled-components';

import PageWrapper from '../../common/pageWrapper';
import Audio from './AudioPage';
import ContentBox from '../../common/contentBox/ContentBox';

const AudioPage = () => (
  <PageWrapper>
    <ContentBox>
      <Audio />
    </ContentBox>
  </PageWrapper>
);

export default AudioPage;
