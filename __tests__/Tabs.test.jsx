import 'react-log-state';
import App from '../src/components/Main';

ReactLogState.logAll(); // eslint-disable-line

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
  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toIncludeText('Any content 1');
    const tabDisabled = wrapper.find(datatest).at(1);
    tabDisabled.simulate('click');
    expect(wrapper).not.toIncludeText('Any content 2');
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    expect(wrapper).toIncludeText('Any content 1');
    const tab = wrapper.find(datatest).at(2);
    tab.simulate('click');
    expect(wrapper).toIncludeText('Any content 3');
  });
});

describe('Tabs CRUD', () => {
  test('create', () => {
    const wrapper = mount(<App />);
    const addButton = wrapper.find('[data-test="button-add"]');
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement('[data-test="form"]');
    const inputTitle = wrapper.find('[data-test="input-title"]');
    const inputContent = wrapper.find('[data-test="input-content"]');
    const saveButton = wrapper.find('[data-test="button-submit"]');
    const title = 'Title Test';
    const content = 'Content Test';
    inputTitle.simulate('change', { target: { value: title } });
    inputContent.simulate('change', { target: { value: content } });
    saveButton.simulate('click');
    expect(wrapper).toIncludeText(content);
  });

  test('create cancel', () => {
    const wrapper = mount(<App />);
    const addButton = wrapper.find('[data-test="button-add"]');
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement('[data-test="form"]');
    const cancelButton = wrapper.find('[data-test="button-cancel"]');
    cancelButton.simulate('click');
    expect(wrapper).not.toContainMatchingElement('[data-test="form"]');
  });

  test('delete', () => {
    const wrapper = mount(<App />);
    const removeButtons = wrapper.find('[data-test="button-remove"]');
    removeButtons.at(2).simulate('click');
    expect(wrapper).not.toIncludeText('Title 3');
  });
});
