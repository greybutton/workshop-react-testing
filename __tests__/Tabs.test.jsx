import MyTabs from '../src/components/Tabs';

describe('<Tabs />', () => {
  const datatest = 'li[data-test^="tab"]';

  test('render', () => {
    const wrapper = mount(<MyTabs />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on disabled', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find(datatest).at(1);
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on active tab', () => {
    const wrapper = mount(<MyTabs />);
    const tabDisabled = wrapper.find(datatest).at(2);
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
