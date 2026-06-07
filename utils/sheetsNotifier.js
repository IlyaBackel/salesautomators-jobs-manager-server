const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

async function postToSheets(data) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log('Sheets webhook not configured. Would send:', data);
    return;
  }
  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Sheets error: ${response.status}`);
    console.log('Sheets updated');
  } catch (error) {
    console.error('Failed to update Sheets:', error);
  }
}

async function logJobCreated(job) {
  const data = {
    action: 'create',
    id: job.id,
    firstName: job.firstName,
    lastName: job.lastName,
    phone: job.phone,
    jobType: job.jobType,
    status: job.status,
    startDate: job.startDate,
    address: job.address,
    city: job.city,
    createdAt: job.createdAt,
  };
  await postToSheets(data);
}

async function updateSheetsStatus(job, newStatus, oldStatus, cancellationReason) {
  const data = {
    action: 'update_status',
    id: job.id,
    firstName: job.firstName,
    lastName: job.lastName,
    phone: job.phone,
    jobType: job.jobType,
    oldStatus: oldStatus,
    newStatus: newStatus,
    startDate: job.startDate,
    address: job.address,
    city: job.city,
    cancellationReason: cancellationReason || '',
  };
  await postToSheets(data);
}

module.exports = { logJobCreated, updateSheetsStatus };