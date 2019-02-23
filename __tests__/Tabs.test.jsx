import App from '../src/components/Main';

describe('Tabs', () => {
  const datatest = 'li[data-test^="tab"]';

  test('render', () => {
    const wrapper = mount(<App />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    const tabDisabled = wrapper.find(datatest).at(1);
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    const tab = wrapper.find(datatest).at(2);
    tab.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
