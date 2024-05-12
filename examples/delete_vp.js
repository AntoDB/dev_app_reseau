// ES6 class 
class EasyHTTP { 

    // Make an HTTP PUT Request 
    async delete(url, data) { 
    
        // Awaiting fetch which contains method, 
        // headers and content-type and body 
        const response = await fetch(url, { 
        method: 'DELETE', 
        headers: { 
            'Content-type': 'application/json'
        }, 
        body: JSON.stringify(data) 
        }); 
        
        // Awaiting response.json() 
        const resData = await response.json(); 
    
        // Return response data 
        return resData; 
    } 
}


// Instantiating new EasyHTTP class 
const http = new EasyHTTP;
// MongoDB ID to edit - REPLACE BY YOUR ID
const id = "663d37619ca1b1fa0811ccd7";

// Update Post 
http.delete( 
'http://localhost:3000/api/vehicle_positions_stib/' + id)

// Resolving promise for response data 
.then(data => console.log(data)) 

// Resolving promise for error 
.catch(err => console.log(err));
