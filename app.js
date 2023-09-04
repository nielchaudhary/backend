const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const dbConnect = require('./dbConnect');
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const User = require('./model.js')


const secretkey = "1234";

app.use(express.json());
dbConnect();

const deanAvailability = [
    {
        day: '2023-09-04',
        time: '11:00:00',
        isAvailable: true,
    },
    {
        day: '2023-09-14',
        time: '17:00:00',
        isAvailable: true,
    },
    {
        day: '2023-09-16',
        time: '20:00:00',
        isAvailable: true,
    },
];


const pendingSessions = [];



// Registration Endpoint
app.post('/register', async (req, res) => {
    const { universityId, password, role } = req.body;

    // Check if the role is valid (User or Dean)
    if (role !== 'User' && role !== 'Dean') {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ universityId });
    if (existingUser) {
        return res.status(400).json({ message: `${role} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = uuid.v4();

    // Create a new user with the specified role
    const newUser = new User({
        universityId,
        password: hashedPassword,
        Role: role,
        token
    });

    await newUser.save();
    res.status(200).json({ message: `${role} Registered Successfully`, Data: newUser });
});



// Login Endpoint
app.post('/login', async (req, res) => {
    const { universityId, password, role } = req.body;

    // Check if the role is valid (User or Dean)
    if (role !== 'User' && role !== 'Dean') {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    // Find the user by universityId and role
    const existingUser = await User.findOne({ universityId, Role: role });

    if (!existingUser) {
        return res.status(400).json({ message: "Invalid Login Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    const jwToken = jwt.sign(universityId, secretkey);
    res.status(200).json({ message: `${role} Login successful`, jwToken: jwToken });

});





//Endpoint to view Dean's Availability slot OR For users to check the free Slots

app.get('/dean/available',(req,res)=>{
    const available = deanAvailability.filter((element)=>element.isAvailable)
    res.status(200).json(available);
})

//Endpoint to book Dean's slot :
app.post('/dean/bookSlot',async (req,res)=>{
    const{ token,SlotIndex} = req.body;
    const ogUser = await User.findOne({token})
    if(ogUser){
        if(SlotIndex<0||SlotIndex>deanAvailability.length){
            res.json({message : "Invalid slot Index"})
        }
        if(!deanAvailability[SlotIndex].isAvailable){
            res.json({message : "slot not available."})
        }
        //Book the slot
        deanAvailability[SlotIndex].isAvailable = false;
        const pendingSession = {
            Details: {
                day: deanAvailability[SlotIndex].day,
                time: deanAvailability[SlotIndex].time,
                studentDetails: ogUser,
            },
        };

        pendingSessions.push(pendingSession);

        res.json({message : "Slot booked successfully", slot : deanAvailability[SlotIndex]})



    }else{
        res.status(400).json({message: "Incorrect token entered"})
    }
})

// Logic for dean to check all his pending sessions:
app.get('/dean/pendingsession', (req, res) => {
    const currentTime = new Date().toISOString(); // Get the current time in ISO 8601 format

    // Filter the pendingSessions to only include sessions in the future
    const futureSessions = pendingSessions.filter(session => {
        const sessionDateTime = new Date(session.Details.day + 'T' + session.Details.time);

        // Compare sessionDateTime with the current time in ISO 8601 format
        return sessionDateTime.toISOString() > currentTime;
    });

    res.json({ Sessions: futureSessions });
});



app.listen(3000,()=>{
    console.log("THIS APP IS RUNNING ON PORT 3000")
})

