import MyTabs from '../src/components/Tabs';

describe('<Tabs />', () => {
  test('render', () => {
    const wrapper = mount(<MyTabs />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on disabled', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find('[data-test="tab-disabled"]');
    tabDisabled.map(t => t.simulate('click'));
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on active tab', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find('[data-test="tab-3"]');
    tabDisabled.map(t => t.simulate('click'));
    expect(wrapper.render()).toMatchSnapshot();
  });
});
