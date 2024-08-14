import { ReactNode } from 'react';

const TabWrapper = (props: {
  tab: string;
  activeTab: string;
  handleTabClick: (tab: string) => void;
  children: ReactNode;
}) => {
  return (
    <>
      <input
        type="radio"
        name={props.tab}
        role="tab"
        className="daisyui-tab"
        aria-label={props.tab}
        checked={props.activeTab === props.tab}
        onClick={() => {
          props.handleTabClick(props.tab);
        }}
      />
      <div
        role="tabpanel"
        className="daisyui-tab-content rounded-box border-base-300 bg-base-100 p-6"
      >
        {props.children}
      </div>
    </>
  );
};

export { TabWrapper };
