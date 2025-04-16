import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    height: 100%;
  }
`;

export const AppS = styled.div`
  min-height: 100%;
  height: 100%;
`;

export const MainS = styled.main`
  height: 100%;
  font-family: 'Arial', Helvetica, sans-serif;
  margin: 0 auto;
`;
