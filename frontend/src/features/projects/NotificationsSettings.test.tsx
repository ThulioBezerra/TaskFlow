import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import NotificationsSettings from './NotificationsSettings';

describe('NotificationsSettings', () => {
  it('renders the form elements correctly', () => {
    render(
      <NotificationsSettings
        webhookUrl=""
        setWebhookUrl={() => {}}
        notificationEvents={[]}
        setNotificationEvents={() => {}}
      />
    );

    expect(screen.getByLabelText('Webhook URL:')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Created')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Completed')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Status Changed')).toBeInTheDocument();
  });

  it('calls setWebhookUrl when the webhook URL input changes', () => {
    const setWebhookUrl = vi.fn();
    render(
      <NotificationsSettings
        webhookUrl=""
        setWebhookUrl={setWebhookUrl}
        notificationEvents={[]}
        setNotificationEvents={() => {}}
      />
    );

    const input = screen.getByLabelText('Webhook URL:');
    fireEvent.change(input, { target: { value: 'http://example.com' } });
    expect(setWebhookUrl).toHaveBeenCalledWith('http://example.com');
  });

  it('calls setNotificationEvents when a checkbox is clicked', () => {
    const setNotificationEvents = vi.fn();
    render(
      <NotificationsSettings
        webhookUrl=""
        setWebhookUrl={() => {}}
        notificationEvents={[]}
        setNotificationEvents={setNotificationEvents}
      />
    );

    const checkbox = screen.getByLabelText('Task Created');
    fireEvent.click(checkbox);
    expect(setNotificationEvents).toHaveBeenCalledWith(['Task Created']);
  });
});
