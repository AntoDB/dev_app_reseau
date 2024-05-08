// ES6 class 
class EasyHTTP { 

    // Make an HTTP PUT Request 
    async put(url, data) { 
    
        // Awaiting fetch which contains method, 
        // headers and content-type and body 
        const response = await fetch(url, { 
        method: 'PUT', 
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
// User Data 
const data = { 
    lineid: "150",
    directionId: "9600",
    distanceFromPoint: 0,
    pointId: "1350"
}
// MogoDB ID to edit
const id = "663b96908cf121cc9a7d8a08";

// Update Post 
http.put( 
'http://localhost:3000/api/data/' + id, 
	data)

// Resolving promise for response data 
.then(data => console.log(data)) 

// Resolving promise for error 
.catch(err => console.log(err));
