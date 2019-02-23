import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const MyTabs = () => (
  <Tabs>
    <TabList>
      <Tab data-test="tab-0">Title 1</Tab>
      <Tab disabled data-test="tab-1">Title 2 (disabled)</Tab>
      <Tab data-test="tab-2">Title 3</Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 3</h2>
    </TabPanel>
  </Tabs>
);

export default MyTabs;
