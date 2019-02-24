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
  addTabButton: () => wrapper.find('[data-test="button-add"]').at(0),
  saveTabButton: () => wrapper.find('[data-test="button-submit"]'),
  cancelTabButton: () => wrapper.find('[data-test="button-cancel"]'),
  removeTabButton: () => wrapper.find('[data-test="button-remove"]'),
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

describe('Save active tabs to cookies', () => {
  const cookiesStub = () => {
    const cookie = {};
    return {
      set: (field, value) => { cookie[field] = value; },
      get: field => cookie[field],
    };
  };
  const cookie = cookiesStub();

  test('set cookie', () => {
    const wrapper = mount(<App cookie={cookie} />);
    const s = buildSelector(wrapper);
    const tab = s.tabAt(2);
    tab.simulate('click');
  });

  test('get cookie', () => {
    const wrapper = mount(<App cookie={cookie} />);
    const s = buildSelector(wrapper);
    const tab = s.tabAt(2);
    expect(tab).toHaveProp('aria-selected', 'true');
  });
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
