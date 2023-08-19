import { API_ENDPOINTS } from "../constants";


const authenticateAndFetchInstagram = async (uid: string, code:string, signal?: AbortSignal) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.AUTHENTICATE_AND_FETCH_INSTAGRAM}/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,   
      body: JSON.stringify({code})
    });
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log('Error message:', error.message);
  }
};

const disconnectFromInstagram = async (uid: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.DISCONNECT_FROM_INSTAGRAM}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,  
      body: JSON.stringify({uid}) 
    });
    const data = await response.json();
    return data;
  } catch (error:any) {
    console.log('Error message:', error.message);
  }
};

const refetchInstagram = async (uid: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.REFETCH_INSTAGRAM}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,  
      body: JSON.stringify({uid}) 
    });
    
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error:any) {
    console.log('Error message:', error.message);
  }
};


export const InstagramService = () => {
    return{
    authenticateAndFetchInstagram,
    disconnectFromInstagram,
    refetchInstagram
    }
}