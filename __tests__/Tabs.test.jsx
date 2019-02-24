import { promises as fsPromises } from 'fs';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import delay from 'delay';
import 'react-log-state';
import App from '../src/components/Main';
import parseRSS from '../lib/parserRSS';

axios.defaults.adapter = httpAdapter;
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
  addButtonTab: () => wrapper.find('[data-test="button-add"]').at(0),
  saveButtonTab: () => wrapper.find('[data-test="button-submit"]'),
  cancelButtonTab: () => wrapper.find('[data-test="button-cancel"]'),
  removeButtonsTab: () => wrapper.find('[data-test="button-remove"]'),
  linkInputRSS: () => wrapper.find('[data-test="input-link"]'),
  addButtonRSS: () => wrapper.find('[data-test="button-add"]').at(1),
  saveButtonRSS: () => wrapper.find('[data-test="button-submit"]'),
  cancelButtonRSS: () => wrapper.find('[data-test="button-cancel"]'),
  removeButtonRSS: () => wrapper.find('[data-test="button-remove"]'),
});


describe('Tabs without snapshots', () => {
  test('click on disabled tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const disabledTab = s.tabAt(1);
    disabledTab.simulate('click');
    const sameDisabledTab = s.tabAt(1);
    expect(sameDisabledTab).toHaveProp('aria-disabled', 'true');
  });

  test('click on normal tab', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const tab = s.tabAt(2);
    tab.simulate('click');
    const activeTab = s.tabAt(0);
    const notActiveTab = s.tabAt(2);
    expect(activeTab).toHaveProp('aria-selected', 'false');
    expect(notActiveTab).toHaveProp('aria-selected', 'true');
  });
});

describe('Tabs CRUD', () => {
  test('create', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const addButton = s.addButtonTab();
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement(dataForm);
    const inputTitle = s.titleInputTab();
    const inputContent = s.contentInputTab();
    const saveButton = s.saveButtonTab();
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
    const addButton = s.addButtonTab();
    addButton.simulate('click');
    expect(wrapper).toContainMatchingElement(dataForm);
    const cancelButton = s.cancelButtonTab();
    cancelButton.simulate('click');
    expect(wrapper).not.toContainMatchingElement(dataForm);
  });

  test('delete', () => {
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    const removeButtons = s.removeButtonsTab();
    const tabsBeforeDelete = s.tabsBox();
    expect(tabsBeforeDelete).toContainMatchingElements(3, dataTab);
    removeButtons.at(2).simulate('click');
    const tabsAfterDelete = s.tabsBox();
    expect(tabsAfterDelete).toContainMatchingElements(2, dataTab);
  });
});

test('Save active tabs to cookies', () => {
  const cookiesStub = () => {
    const cookie = {};
    return {
      set: (field, value) => { cookie[field] = value; },
      get: field => cookie[field],
    };
  };
  const cookie = cookiesStub();

  const wrapper = mount(<App cookie={cookie} />);
  const s = buildSelector(wrapper);
  const tab = s.tabAt(2);
  tab.simulate('click');

  const wrapper2 = mount(<App cookie={cookie} />);
  const s2 = buildSelector(wrapper2);
  const tab2 = s2.tabAt(2);
  expect(tab2).toHaveProp('aria-selected', 'true');
});

describe('RSS', () => {
  test('save rss tab', async () => {
    const fixturesPathRSS = '__tests__/__fixtures__/rss.xml';
    const xml = await fsPromises.readFile(fixturesPathRSS, { encoding: 'utf8' });
    const { title, description } = parseRSS(xml);
    const host = 'https://cors-anywhere.herokuapp.com/';
    const url = 'test';
    nock(host)
      .get(`/${url}`)
      .reply(200, xml);
    const wrapper = mount(<App />);
    const s = buildSelector(wrapper);
    s.addButtonRSS().simulate('click');
    const inputLink = s.linkInputRSS();
    inputLink.simulate('change', { target: { value: url } });
    const tabsBeforeSave = s.tabsBox();
    expect(tabsBeforeSave).toContainMatchingElements(3, dataTab);
    const saveButton = s.saveButtonRSS();
    saveButton.simulate('click');
    await delay(100);
    wrapper.update();
    const tabsAfterSave = s.tabsBox();
    expect(tabsAfterSave).toContainMatchingElements(4, dataTab);
    expect(wrapper).toIncludeText(title);
    expect(wrapper).toIncludeText(description);
  });
});
