import { Wrapper, Title, OptButton } from './StyledComp.js'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from "react";

export default function MainPage({ isPending }) {
    const location = useLocation();
    useEffect(() => {
      console.log('Route changed to', location.pathname);
      // Add any additional effects you want to run on route change here
    }, [location]);
    return (
      <div className="mainPage">
        <Wrapper style={{
          opacity: isPending ? 0.7 : 1 
        }}>
          <Title>SAMAT version 1.1</Title>
        </Wrapper>
        <Link to={`/first-vm`}>
          <OptButton>
            Android 9
          </OptButton>
        </Link>
        <Link to={`/second-vm`}>
          <OptButton>
            Android 12 
          </OptButton>
        </Link>

        <Outlet />
      </div>
    );
  }

