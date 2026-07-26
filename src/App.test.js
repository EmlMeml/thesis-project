import { generatePrompt } from './custom/ChangeCreator';

test('includes editor text content in the generated prompt', () => {
  const prompt = generatePrompt('rewrite this', 1, 2, 'Hello from the editor');

  expect(prompt).toContain('Hello from the editor');
  expect(prompt).toContain('Pond');
  expect(prompt).toContain('Cobblestone');
});
