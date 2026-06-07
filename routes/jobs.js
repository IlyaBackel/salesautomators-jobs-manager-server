const express = require('express');
const router = express.Router();
const { readJobs, writeJobs } = require('../utils/fileHelper');
const { sendSlackJobCreated, sendSlackStatusChange } = require('../utils/slackNotifier');
const { logJobCreated, updateSheetsStatus } = require('../utils/sheetsNotifier');
const { sendCompletionEmail } = require("../utils/emailNotifier")
const { logEvent } = require('../utils/logger');

function validateRequiredFields(body) {
  const required = ['firstName', 'lastName', 'phone', 'jobType', 'jobSource', 
                    'address', 'city', 'state', 'zipCode', 'area', 
                    'startDate', 'startTime', 'endTime', 'techSelect'];
  const missing = required.filter(field => !body[field] || body[field].trim() === '');
  if (missing.length > 0) {
    return { valid: false, error: `Missing fields: ${missing.join(', ')}` };
  }
  return { valid: true };
}

router.get('/', (req, res) => {
  try {
    const jobs = readJobs();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read jobs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validation = validateRequiredFields(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const jobs = readJobs();
    const newJob = {
      id: Date.now(), 
      ...req.body,
      status: 'Job Created',
      createdAt: new Date().toISOString(),
    };

    jobs.push(newJob);
    writeJobs(jobs);
    logEvent(`Job created - ID ${newJob.id} - ${newJob.firstName} ${newJob.lastName} - ${newJob.jobType}`);
    sendSlackJobCreated(newJob)
    logJobCreated(newJob)

    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const jobs = readJobs();
    const jobIndex = jobs.findIndex(j => j.id == req.params.id);
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const oldStatus = jobs[jobIndex].status;
    const job = jobs[jobIndex];
    
    job.status = status;
    
    if ((status === 'Cancelled') && cancellationReason) {
      job.cancellationReason = cancellationReason;
    }
    
    writeJobs(jobs);

    logEvent(`Status change - Job ${job.id} - from ${oldStatus} to ${status}`);
    sendSlackStatusChange(job, oldStatus, status, cancellationReason).catch(err => console.error(err));
    updateSheetsStatus(job, status, oldStatus, cancellationReason).catch(err => console.error(err));

    if (status === 'Completed') {
      try {
        sendCompletionEmail(job).catch(err => console.error('Email error:', err));;
      } catch (err) { console.error('Email error:', err); }
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;