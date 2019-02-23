import App from '../src/components/Main';

const datatest = 'li[data-test^="tab"]';

describe('Tabs', () => {
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

describe('Tabs without snapshots', () => {
  test('first render', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toIncludeText('Any content 1');
  });

  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toIncludeText('Any content 1');
    const tabDisabled = wrapper.find(datatest).at(1);
    tabDisabled.simulate('click');
    expect(wrapper).toIncludeText('Any content 1');
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toIncludeText('Any content 1');
    const tab = wrapper.find(datatest).at(2);
    tab.simulate('click');
    expect(wrapper).toIncludeText('Any content 3');
  });
});
