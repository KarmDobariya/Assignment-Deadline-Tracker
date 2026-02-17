const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(''))
    .catch(err => console.log(''));

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deadline: {
        type: Date,
        required: true
    },
    maxScore: {
        type: Number,
        required: true,
        default: 100
    },
    penaltyRate: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

app.get('/api/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find().sort({ deadline: 1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/assignments', async (req, res) => {
    const assignment = new Assignment({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        maxScore: req.body.maxScore,
        penaltyRate: req.body.penaltyRate
    });

    try {
        const newAssignment = await assignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/assignments/:id/submit', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const submissionTime = new Date();
        const deadline = new Date(assignment.deadline);
        let penalty = 0;
        let lateDuration = 0;

        if (submissionTime > deadline) {
            const diffMs = submissionTime - deadline;
            const diffHrs = diffMs / (1000 * 60 * 60);
            lateDuration = diffHrs;

            const deductionPercent = assignment.penaltyRate * diffHrs;
            const deductionAmount = (deductionPercent / 100) * assignment.maxScore;
            penalty = Math.min(deductionAmount, assignment.maxScore);
        }

        const finalScore = Math.max(0, assignment.maxScore - penalty);

        res.json({
            submissionTime,
            deadline,
            lateHours: lateDuration,
            penalty,
            finalScore,
            maxScore: assignment.maxScore
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
