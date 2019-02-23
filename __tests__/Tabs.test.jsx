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
    const tabDisabled = wrapper.find(datatest).at(1);
    tabDisabled.simulate('click');
    expect(wrapper.find(datatest).at(1)).toHaveProp('aria-disabled', 'true');
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    const tab = wrapper.find(datatest).at(2);
    tab.simulate('click');
    const tabActive = wrapper.find(datatest).at(0);
    const tabNotActive = wrapper.find(datatest).at(2);
    expect(tabActive).toHaveProp('aria-selected', 'false');
    expect(tabNotActive).toHaveProp('aria-selected', 'true');
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
    const tabsBeforeCreate = wrapper.find('ul[data-test="tabs-box"]');
    expect(tabsBeforeCreate).toContainMatchingElements(3, datatest);
    saveButton.simulate('click');
    const tabsAfterCreate = wrapper.find('ul[data-test="tabs-box"]');
    expect(tabsAfterCreate).toContainMatchingElements(4, datatest);
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
    const tabsBeforeDelete = wrapper.find('ul[data-test="tabs-box"]');
    expect(tabsBeforeDelete).toContainMatchingElements(3, datatest);
    removeButtons.at(2).simulate('click');
    const tabsAfterDelete = wrapper.find('ul[data-test="tabs-box"]');
    expect(tabsAfterDelete).toContainMatchingElements(2, datatest);
  });
});
