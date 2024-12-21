import { SNSEvent } from 'aws-lambda';
import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export const handler = async (event: SNSEvent) => {
  const message = event.Records[0].Sns.Message;
  
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `🚨 Alert: ${message}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Alert Triggered*\n${message}`
          }
        }
      ]
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    throw error;
  }
}; 