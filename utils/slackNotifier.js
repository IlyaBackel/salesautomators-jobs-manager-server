const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function sendSlackMessage(text) {
  if (!SLACK_WEBHOOK_URL) {
    console.log('Slack webhook not configured. Would send:', text);
    return;
  }
  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error(`Slack error: ${response.status}`);
  } catch (error) {
    console.error('Failed to send Slack message:', error);
  }
}

async function sendSlackJobCreated(job) {
  const message = `*NEW JOB CREATED*\n*Customer:* ${job.firstName} ${job.lastName}\n*Phone:* ${job.phone}\n*Job Type:* ${job.jobType}\n*Address:* ${job.address}, ${job.city}\n*Scheduled:* ${job.startDate} ${job.startTime}\n*Technician:* ${job.techSelect}\n*Status:* ${job.status}`;
  await sendSlackMessage(message);
}

async function sendSlackStatusChange(job, oldStatus, newStatus, cancellationReason) {
  let message = '';
  switch (newStatus) {
    case 'Scheduled':
      message = `*JOB SCHEDULED*\nJob #${job.id} for *${job.firstName} ${job.lastName}*\nStatus changed from *${oldStatus}* → *${newStatus}*.\nScheduled time: ${job.startDate} ${job.startTime}`;
      break;
    case 'In Progress':
      message = `*JOB IN PROGRESS*\nJob #${job.id} for *${job.firstName} ${job.lastName}*\nTechnician ${job.techSelect} is on the way / working.`;
      break;
    case 'Completed':
      message = `*JOB COMPLETED*\nJob #${job.id} for *${job.firstName} ${job.lastName}* has been completed. Great work!`;
      break;
    case 'Cancelled':
      message = `*JOB ${newStatus.toUpperCase()}*\nJob #${job.id} for *${job.firstName} ${job.lastName}* was ${newStatus.toLowerCase()}.\nReason: ${cancellationReason || 'Not provided'}`;
      break;
    default:
      message = `*STATUS CHANGE*\nJob #${job.id} for ${job.firstName} ${job.lastName}\nChanged from *${oldStatus}* → *${newStatus}*`;
  }
  await sendSlackMessage(message);
}

module.exports = { sendSlackJobCreated, sendSlackStatusChange };