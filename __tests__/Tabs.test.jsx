import 'react-log-state';
import App from '../src/components/Main';

ReactLogState.logAll(); // eslint-disable-line

const dataTab = 'li[data-test="tab"]';
const dataForm = '[data-test="form"]';

const buildSelector = wrapper => ({
  tabs: () => wrapper.find(dataTab),
  tabAt: i => wrapper.find(dataTab).at(i),
  tabsBox: () => wrapper.find('ul[data-test="tabs-box"]'),
  form: () => wrapper.find(dataForm),
  titleInputTab: () => wrapper.find('[data-test="input-title"]'),
  contentInputTab: () => wrapper.find('[data-test="input-content"]'),
  addTabButton: () => wrapper.find('[data-test="button-add"]'),
  saveTabButton: () => wrapper.find('[data-test="button-submit"]'),
  cancelTabButton: () => wrapper.find('[data-test="button-cancel"]'),
  removeTabButton: () => wrapper.find('[data-test="button-remove"]'),
});

describe('Tabs', () => {
  test('render', () => {
    const wrapper = mount(<App />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const tabDisabled = s.tabAt(1);
    tabDisabled.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const tab = s.tabAt(2);
    tab.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});

describe('Tabs without snapshots', () => {
  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const tabDisabled = s.tabAt(1);
    tabDisabled.simulate('click');
    const sameTabDisabled = s.tabAt(1);
    expect(sameTabDisabled).toHaveProp('aria-disabled', 'true');
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const tab = s.tabAt(2);
    tab.simulate('click');
    const tabActive = s.tabAt(0);
    const tabNotActive = s.tabAt(2);
    expect(tabActive).toHaveProp('aria-selected', 'false');
    expect(tabNotActive).toHaveProp('aria-selected', 'true');
  });
});

describe('Tabs CRUD', () => {
  test('create', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const addButton = s.addTabButton();
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement(dataForm);
    const inputTitle = s.titleInputTab();
    const inputContent = s.contentInputTab();
    const saveButton = s.saveTabButton();
    const title = 'Title Test';
    const content = 'Content Test';
    inputTitle.simulate('change', { target: { value: title } });
    inputContent.simulate('change', { target: { value: content } });
    const tabsBeforeCreate = s.tabsBox();
    expect(tabsBeforeCreate).toContainMatchingElements(3, dataTab);
    saveButton.simulate('click');
    const tabsAfterCreate = s.tabsBox();
    expect(tabsAfterCreate).toContainMatchingElements(4, dataTab);
  });

  test('create cancel', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const addButton = s.addTabButton();
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement(dataForm);
    const cancelButton = s.cancelTabButton();
    cancelButton.simulate('click');
    expect(wrapper).not.toContainMatchingElement(dataForm);
  });

  test('delete', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const removeButtons = s.removeTabButton();
    const tabsBeforeDelete = s.tabsBox();
    expect(tabsBeforeDelete).toContainMatchingElements(3, dataTab);
    removeButtons.at(2).simulate('click');
    const tabsAfterDelete = s.tabsBox();
    expect(tabsAfterDelete).toContainMatchingElements(2, dataTab);
  });
});
