import axios from 'customFunction/customAxios';
import { useEffect, useState } from 'react';

function Test() {
  const [a, setA] = useState('failed');
  const fetchData = async () => {
    try {
      const response = await axios.public.get('api/token/get');
      setA(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>{a}</header>
      <button
        onClick={() => {
          fetchData();
        }}
      >
        test
      </button>
    </div>
  );
}
export default Test;

