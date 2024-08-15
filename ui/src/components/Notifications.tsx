import { Toast, Alert, Button } from 'react-daisyui';
import { DynamicToastChild } from './Tabs';
import { Dispatch, SetStateAction } from 'react';

const daisyUiAlertClass = (status: string) => {
  switch (status) {
    case 'info':
      return 'daisyui-alert-info';
    case 'success':
      return 'daisyui-alert-success';
    case 'warning':
      return 'daisyui-alert-warning';
    case 'error':
      return 'daisyui-alert-error';
    default:
      return '';
  }
};

const Notifications = (props: {
  notifications: DynamicToastChild[];
  setNotifications: Dispatch<SetStateAction<DynamicToastChild[]>>;
}) => {
  const handleRemoveToast = (index: number) => {
    props.setNotifications(notifications =>
      notifications.filter((_, i) => i !== index),
    );
  };

  return (
    <Toast className="daisyui-toast daisyui-toast-end daisyui-toast-top mt-14">
      {props.notifications.map((alert, index) => (
        <Alert
          className={'daisyui-alert ' + daisyUiAlertClass(alert.status)}
          key={index}
          status={alert.status}
        >
          <div className="w-full flex-row justify-between gap-2">
            <h3>{alert.text}</h3>
          </div>
          <Button color="ghost" onClick={() => handleRemoveToast(index)}>
            X
          </Button>
        </Alert>
      ))}
    </Toast>
  );
};

export { Notifications };
