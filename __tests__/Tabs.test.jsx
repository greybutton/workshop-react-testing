import MyTabs from '../src/components/Tabs';

describe('<Tabs />', () => {
  test('render', () => {
    const wrapper = mount(<MyTabs />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on disabled', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find('Tab[data-test="tab-disabled"]');
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on active tab', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find('Tab[data-test="tab-3"]');
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
