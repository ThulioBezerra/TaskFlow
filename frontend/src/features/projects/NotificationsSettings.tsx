import React from 'react';

interface NotificationsSettingsProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  notificationEvents: string[];
  setNotificationEvents: (events: string[]) => void;
}

const availableEvents = [
  "Task Created",
  "Task Completed",
  "Task Status Changed"
];

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  webhookUrl,
  setWebhookUrl,
  notificationEvents,
  setNotificationEvents,
}) => {
  const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (checked) {
      setNotificationEvents([...notificationEvents, name]);
    } else {
      setNotificationEvents(notificationEvents.filter((e) => e !== name));
    }
  };

  return (
    <div className="notifications-settings">
      <h3>Notifications</h3>
      <div className="form-group">
        <label htmlFor="webhookUrl">Webhook URL:</label>
        <input
          type="url"
          id="webhookUrl"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
        />
      </div>
      <div className="form-group">
        <label>Notify on:</label>
        <div className="checkbox-group">
          {availableEvents.map((event) => (
            <label key={event}>
              <input
                type="checkbox"
                name={event}
                checked={notificationEvents.includes(event)}
                onChange={handleEventChange}
              />
              {event}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;
