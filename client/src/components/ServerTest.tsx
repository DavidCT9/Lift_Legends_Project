import React, { useEffect } from 'react';

export const ServerTest = () => {
    const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/hello');
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      // useEffect to call fetchData when the component mounts
      useEffect(() => {
        fetchData();
      }, []); // The empty array ensures the effect runs only once (on mount)
    return (
        <>
            <h1>Test Fetch Component</h1>
            <p>Check the console for the fetched data.</p>
        </>
    )
}

export default ServerTest;
