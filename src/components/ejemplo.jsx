import React from 'react'
import styled, { css } from 'styled-components';

const Container = styled.div`
  /* styles for all screen sizes */

  ${props => props.theme.media.desktop`
    background-color: red;
    color: white;
    padding: 20px;
  `}

  ${props => props.theme.media.tablet`
    background-color: blue;
    color: white;
    padding: 15px;
  `}

  ${props => props.theme.media.mobile`
    background-color: green;
    color: white;
    padding: 10px;
  `}
`;

const media = {
  desktop: (...args) => css`
    @media (min-width: 1024px) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (max-width: 1023px) and (min-width: 768px) {
      ${css(...args)}
    }
  `,
  mobile: (...args) => css`
    @media (max-width: 767px) {
      ${css(...args)}
    }
  `,
};

const theme = {
  media
};

const StyledComponent = () => (
  <Container theme={theme}>
    <h1>Responsive Heading</h1>
    <p>Responsive text content</p>
  </Container>
);

export default StyledComponent;
