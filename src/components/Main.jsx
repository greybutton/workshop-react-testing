import React from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


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
  }

  handleSelectTab = tabIndex => this.setState({ tabIndex });

  handleOpenNewForm = () => this.setState(prevState => ({ ...prevState, form: { state: 'new' } }));

  handleCloseForm = () => this.setState(prevState => ({ ...prevState, form: { state: 'close' } }));

  onChangeTitle = (e) => {
    const { target: { value } } = e;
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, title: value } }));
  }

  onChangeContent = (e) => {
    const { target: { value } } = e;
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, content: value } }));
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
        className="btn btn-primary"
      >
        Submit
      </button>
      <button
        data-test="button-cancel"
        onClick={this.handleCloseForm}
        type="button"
        className="btn btn-secondary"
      >
        Cancel
      </button>
    </form>
  )

  render() {
    const { tabIndex, tabs, form } = this.state;
    const isFormOpen = form.state === 'new';

    return (
      <div className="container">
        <h1>Hello</h1>
        <button
          data-test="button-add"
          type="button"
          onClick={this.handleOpenNewForm}
          className="btn btn-primary"
        >
          Add tab
        </button>
        {isFormOpen && this.renderForm()}
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
