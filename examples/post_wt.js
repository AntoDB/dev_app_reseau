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
    pointid: "5000",
    lineid: "50",
    destination: {
      "fr": "_MACHELEN",
      "nl": "MACHELEN_"
    },
    expectedArrivalTime: "2000-05-11T22:39:00+02:00",
    lineId: "50"
}

// Update Post 
http.post( 
'http://localhost:3000/api/waiting_time_stib/', 
	data)

// Resolving promise for response data 
.then(data => console.log(data)) 

// Resolving promise for error 
.catch(err => console.log(err));
