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
// User Data - REPLACE BY YOUR DATA
const data = { 
    lineid: "150",
    directionId: "9600",
    distanceFromPoint: 0,
    pointId: "1350"
}
// MongoDB ID to edit - REPLACE BY YOUR ID
const id = "663d2a342acc600dbfc4ab04";

// Update Post 
http.put( 
'http://localhost:3000/api/vehicle_positions_stib/' + id, 
	data)

// Resolving promise for response data 
.then(data => console.log(data)) 

// Resolving promise for error 
.catch(err => console.log(err));
