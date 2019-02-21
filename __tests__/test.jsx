import toJSON from 'enzyme-to-json';
import App from '../src/components/App';

test('example', () => {
  const wrapper = mount(<App />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});
