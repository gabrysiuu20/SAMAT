import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

export const Refresh = styled.img`
  width: 20px;
  height: 20px;
`

// Create a Wrapper component that'll render a <section> tag with some styles
export const Wrapper = styled.section`
  margin: 0;
  padding: 1.5em;
  background: papayawhip;
  justify-content: center;
  text-align: center;
  display: flex;
  opacity: ${props => props.isPending ? 0.7 : 1} 
  align-items: center;
`;

export const OptButton = styled.button`
  /* Adapt the colors based on primary prop */
  background: "white";
  color: #BF4F74";

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

export const StrButton = styled.button`
  background: "white";
  color: #D5852A;
  font-size: 3em;
  
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #D5852A;
  border-radius: 3px;
`;