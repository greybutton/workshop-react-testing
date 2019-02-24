import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import classNames from 'classnames';
import parseRSS from '../../lib/parserRSS';


class Main extends React.Component {
  static id = 3;

  state = {
    tabIndex: 0,
    tabs: [
      { id: 0, title: 'Title 1', content: 'Any content 1' },
      {
        id: 1, title: 'Title 2 (disabled)', content: 'Any content 2', attrs: { disabled: true },
      },
      { id: 2, title: 'Title 3', content: 'Any content 3' },
    ],
    form: {
      state: 'close',
      title: '',
      content: '',
    },
    formRSS: {
      state: 'close',
      link: '',
    },
  }

  componentDidMount() {
    this.getActiveTabCookie();
  }

  setActiveTabToCookie = (index) => {
    const { cookie } = this.props;
    if (!cookie) {
      return;
    }
    cookie.set('tabIndex', index);
  }

  getActiveTabCookie = () => {
    const { cookie } = this.props;
    if (!cookie) {
      return;
    }
    const index = Number(cookie.get('tabIndex'));
    const tabIndex = index <= 2 ? index : 0;
    this.setState({ tabIndex });
  }

  handleSelectTab = (tabIndex) => {
    this.setState({ tabIndex });
    this.setActiveTabToCookie(tabIndex);
  };

  handleOpenNewForm = form => this.setState(prevState => ({ ...prevState, [form]: { state: 'new' } }));

  handleCloseForm = form => this.setState(prevState => ({ ...prevState, [form]: { state: 'close' } }));

  handleOpenNewFormTab = () => this.handleOpenNewForm('form');

  handleCloseFormTab = () => this.handleCloseForm('form');

  handleOpenNewFormRSS = () => this.handleOpenNewForm('formRSS');

  handleCloseFormRSS = () => this.handleCloseForm('formRSS');

  onChangeTitle = (e) => {
    const { target: { value } } = e;
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, title: value } }));
  }

  onChangeContent = (e) => {
    const { target: { value } } = e;
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, content: value } }));
  }

  onChangeLinkRSS = (e) => {
    const { target: { value } } = e;
    this.setState(prevState => ({ ...prevState, formRSS: { ...prevState.formRSS, link: value } }));
  }

  handleRemoveTab = (id) => {
    const { tabs } = this.state;
    const newTabs = tabs.filter(t => t.id !== id);
    this.setState(prevState => ({ ...prevState, tabs: newTabs }));
  }

  handleSaveTab = (e) => {
    e.preventDefault();
    const { form, tabs } = this.state;
    const tab = {
      id: Main.id,
      title: form.title,
      content: form.content,
    };
    const resetForm = {
      state: 'close',
      title: '',
      content: '',
    };
    const newTabs = [...tabs, tab];
    const activeTab = newTabs.length - 1;
    this.setState({ tabs: newTabs, form: resetForm, tabIndex: activeTab });
    Main.id += 1;
    this.setActiveTabToCookie(activeTab);
  }

  handleSaveRSS = async (e) => {
    e.preventDefault();
    const { formRSS: { link }, tabs } = this.state;
    const getProxedURL = url => `https://cors-anywhere.herokuapp.com/${url}`;
    try {
      this.setState(prevState => ({ ...prevState, formRSS: { ...prevState.formRSS, state: 'loading' } }));
      const { data } = await axios.get(getProxedURL(link));
      const { title, description } = parseRSS(data);
      const tab = {
        id: Main.id,
        title,
        content: description,
      };
      const newTabs = [...tabs, tab];
      const activeTab = newTabs.length - 1;
      const resetForm = {
        state: 'close',
        link: '',
      };
      this.setState({ tabs: newTabs, formRSS: resetForm, tabIndex: activeTab });
      Main.id += 1;
      this.setActiveTabToCookie(activeTab);
    } catch (err) {
      this.setState(prevState => ({ ...prevState, formRSS: { ...prevState.formRSS, state: 'error' } }));
      console.log(err);
    }
  }

  renderForm = () => (
    <form
      data-test="form"
    >
      <div className="form-group">
        <label htmlFor="title">
          Title
          <input
            data-test="input-title"
            onChange={this.onChangeTitle}
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="titleHelp"
            placeholder="Enter title"
            autoFocus
          />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="content">
          Content
          <textarea
            data-test="input-content"
            onChange={this.onChangeContent}
            className="form-control"
            id="content"
            name="content"
            rows="3"
          />
        </label>
      </div>
      <button
        data-test="button-submit"
        onClick={this.handleSaveTab}
        type="submit"
        className="btn btn-primary mr-1 mb-1"
      >
        Submit
      </button>
      <button
        data-test="button-cancel"
        onClick={this.handleCloseFormTab}
        type="button"
        className="btn btn-secondary mr-1 mb-1"
      >
        Cancel
      </button>
    </form>
  )

  renderFormRSS = () => {
    const { formRSS: { state } } = this.state;
    const loading = state === 'loading';
    const error = state === 'error';
    const inputClasses = classNames({
      'form-control': true,
      'is-invalid': error,
    });

    return (
      <form data-test="form">
        <div className="form-group">
          <label htmlFor="link">
            RSS link
            <input
              data-test="input-link"
              onChange={this.onChangeLinkRSS}
              type="text"
              className={inputClasses}
              id="link"
              name="link"
              aria-describedby="linkHelp"
              placeholder="Enter link"
              disabled={loading}
              autoFocus
            />
            {error && (
              <div className="invalid-feedback">
                Something went wrong. Please try again.
              </div>
            )}
          </label>
          {loading && (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
        <button
          data-test="button-submit"
          onClick={this.handleSaveRSS}
          type="submit"
          className="btn btn-primary mr-1 mb-1"
          disabled={loading}
        >
          Submit
        </button>
        <button
          data-test="button-cancel"
          onClick={this.handleCloseFormRSS}
          type="button"
          className="btn btn-secondary mr-1 mb-1"
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    );
  }

  render() {
    const {
      tabIndex, tabs, form, formRSS,
    } = this.state;
    const isFormOpen = form.state === 'new';
    const isFormRSSOpen = formRSS.state !== 'close';

    return (
      <div className="container">
        <h1>Hello</h1>
        {!isFormOpen && !isFormRSSOpen && (
          <button
            data-test="button-add"
            type="button"
            onClick={this.handleOpenNewFormTab}
            className="btn btn-primary mr-1 mb-1"
          >
            Add tab
          </button>
        )}
        {!isFormRSSOpen && !isFormOpen && (
          <button
            data-test="button-add"
            type="button"
            onClick={this.handleOpenNewFormRSS}
            className="btn btn-primary mr-1 mb-1"
          >
            Add RSS
          </button>
        )}
        {isFormOpen && this.renderForm()}
        {isFormRSSOpen && this.renderFormRSS()}
        <Tabs selectedIndex={tabIndex} onSelect={this.handleSelectTab}>
          <TabList data-test="tabs-box">
            {tabs.map(({ id, title, attrs }) => (
              <Tab key={id} data-test="tab" {...attrs}>
                {title}
                {' '}
                <button
                  data-test="button-remove"
                  type="button"
                  onClick={() => this.handleRemoveTab(id)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  x
                </button>
              </Tab>
            ))}
          </TabList>
          {tabs.map(({ id, content }) => <TabPanel key={id}>{content}</TabPanel>)}
        </Tabs>
      </div>
    );
  }
}

export default Main;
