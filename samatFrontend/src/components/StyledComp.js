import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`

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
  opacity: ${props => props.isPending ? 0.7 : 1};
  align-items: center;
`

export const OptButton = styled.button`
  /* Adapt the colors based on primary prop */
  background: "white";
  color: "#BF4F74";
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`

export const StrButton = styled.button`
  background: "white";
  color: #D5852A;
  font-size: 3em;
  
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #D5852A;
  border-radius: 3px;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction:column;
  gap: 20px;
  justify-content: center;
`
export const ButtonWithIcon = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items:center; 
  justify-content: center;
  fill: white;
`


export const ButtonWithIcon2 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items:center; 
  justify-content: center;
  fill: white;

  img{
    filter: invert(1);
  }
`

export const EmptyScreenVM = styled.div`
  display: flex;
  width: 900px;
  height: 500px;
  background-color: black;
`

export const InfoBoxLong = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 250px;
  //max-height: 2800px;
  padding: 12px;
  gap: 6px;
  border-radius: 20px;
  background-color: white;
  border: 2px solid grey;
  box-shadow: 0px 2px 2px 0px #FFFFFF80;
  margin-bottom: 20px;
`

export const InfoBoxLongUpper = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 700;
  align-items: center;

  img{
    filter: invert(1);
  }
`

export const InfoBoxLongBottom = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  gap: 2px;
`

export const InfoBoxLongBottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const InfoBoxShort = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  gap: 6px;
  border-radius: 20px;
  background-color: white;
  border: 2px solid grey;
  box-shadow: 0px 2px 2px 0px #FFFFFF80;
  margin-bottom: 20px;
`

export const InfoBoxShortUpper = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 700;
  align-items: center;

  img{
    filter: invert(1);
  }
`

export const InfoBoxShortBottom = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  font-weight: 500;
  gap: 2px;
`

export const InfoBoxShortBottomScrolled = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  gap: 2px;
  height: 300px;
  overflow-y: scroll;
  border: 2px solid #101010;;
  border-radius: 4px;
  padding: 6px 14px 6px 14px;
  background-color: #101010;
  color: white;
  word-break: break-word;
`

export const InfoBoxShortBottomPermissions = styled.div`
  display: flex;
  flex-direction: row;
  height: 300px;
  overflow-y: scroll;
  border: 2px solid #101010;;
  border-radius: 4px;
  background-color: #101010;

`

export const WrapperDiv = styled.div`
  display: wrap;
  word-break: break-all;
`