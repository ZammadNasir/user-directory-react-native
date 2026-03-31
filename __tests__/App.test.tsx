import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders the app shell', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree!.toJSON()).toBeTruthy();
});
