import { useState } from 'react';
import { Mint } from './mint/Mint';
import { TabWrapper } from './TabWrapper';
import { Notifications } from './Notifications';
import { NotificationContext } from '../context/NotificationContext';
import Swap from './swap/Swap';
import Pay from './pay/Pay';
import { MakeAccount } from './MakeAccount/MakeAccount';


// notification related types
const dynamicToastChildStatuses = [
  'info',
  'success',
  'warning',
  'error',
] as const;

type DynamicToastChild = {
  text: string;
  status: (typeof dynamicToastChildStatuses)[number];
};

const Tabs = () => {
  // tab state related functions
  const [activeTab, setActiveTab] = useState('Make Account');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // notification related functions
  const [notifications, setNotifications] = useState<DynamicToastChild[]>([]);

  const addNotification = (newNotification: DynamicToastChild) => {
    setNotifications([...notifications, newNotification]);
  };


  return (
    <div className="my-4 flex w-full flex-row justify-center">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <NotificationContext.Provider
        value={{ addNotification: addNotification }}
      >
        <div
          role="tablist"
          className="daisyui-tabs-boxed daisyui-tabs daisyui-tabs-lg"
        >
          <TabWrapper
            tab="Make Account"
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          >
            {/* <Mint /> */}
            <MakeAccount />
          </TabWrapper>
          <TabWrapper
            tab="IBC Send"
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          >
            {/* <Swap /> */}
          </TabWrapper>
          {/* <TabWrapper
            tab="Pay"
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          >
            <Pay />
          </TabWrapper>
          <TabWrapper
            tab="Vote"
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          >
            <div>TBD</div>
          </TabWrapper> */}
        </div>
      </NotificationContext.Provider>
    </div>
  );
};

export { Tabs };
export type { DynamicToastChild };
