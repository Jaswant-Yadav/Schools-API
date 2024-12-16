const express = require('express');
const app = express();
const connectdb = require("./config");
app.use(express.json());


app.get('/', (req,resp)=>{
    connectdb.query( "select * from schools",(err,result)=>{
        if(err){
            resp.send("error")
        }else{
            resp.send(result)
        }
    })
});


// ADD SCHOOL API

app.post('/addSchool',(req,resp)=>{
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude){
        resp.json("all fields are required")
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
         resp.json( 'Invalid latitude or longitude values');
    }


    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    connectdb.query(query,[name,address,lat,lng],(err,result)=>{
        if(err){
            resp.json("error in database")
        }else{
            resp.status(201).json({ 
                success: true,
                message: 'School added successfully',
                data: {
                    id: result.insertId,
                    name,
                    address,
                    latitude: lat,
                    longitude: lng
                }
            });
        }
    })
});

app.get('/listSchools', (req, resp) => {
    const { latitude, longitude, radius } = req.query;
    const maxRadius = parseFloat(radius) || 50; // Default 50km radius if not specified

    // If no location provided, return all schools
    if (!latitude || !longitude) {
        const query = 'SELECT id, name, address, latitude, longitude FROM schools';
        connectdb.query(query, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return resp.status(500).json({ 
                    success: false, 
                    message: 'Database error',
                    error: err.message 
                });
            }
            return resp.json({
                success: true,
                data: result
            });
        });
        return;
    }

    // Enhanced input validation
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return resp.status(400).json({ 
            success: false, 
            message: 'Invalid latitude or longitude values' 
        });
    }

    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    connectdb.query(query, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return resp.status(500).json({ 
                success: false, 
                message: 'Database error',
                error: err.message 
            });
        }

        if (!result || result.length === 0) {
            return resp.json({
                success: true,
                data: [],
                message: 'No schools found'
            });
        }

        try {
            const userLocation = { lat, lng };
            const schoolsWithDistance = result
                .map(school => ({
                    ...school,
                    distance: haversineDistance(userLocation, { 
                        lat: school.latitude, 
                        lng: school.longitude 
                    })
                }))
                .filter(school => school.distance <= maxRadius)
                .sort((a, b) => a.distance - b.distance);

            resp.json({ 
                success: true, 
                data: schoolsWithDistance,
                message: schoolsWithDistance.length ? 'Schools found successfully' : 'No schools found within the specified radius'
            });
        } catch(error) {
            console.error('Distance calculation error:', error);
            resp.status(500).json({ 
                success: false, 
                message: 'Error calculating distances',
                error: error.message 
            });
        }
    });
});

// Haversine formula
function haversineDistance(coord1, coord2) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});