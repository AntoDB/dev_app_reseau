// ES6 class 
class EasyHTTP { 

    // Make an HTTP PUT Request 
    async post(url, data) { 
    
        // Awaiting fetch which contains method, 
        // headers and content-type and body 
        const response = await fetch(url, { 
        method: 'POST', 
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
// User Data - REPLACE BY YOUR DATA
const data = { 
    lineid: "2750",
    directionId: "9600",
    distanceFromPoint: 50,
    pointId: "2247"
}

// Update Post 
http.post( 
'http://localhost:3000/api/data', 
	data)

// Resolving promise for response data 
.then(data => console.log(data)) 

// Resolving promise for error 
.catch(err => console.log(err));
